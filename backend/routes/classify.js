import express from 'express';
import FieldCache from '../models/FieldCache.js';
import { protect } from '../middlewares/authMiddleware.js';
import { classifyFromMap } from "../services/fieldMap.js";
import { classifyField } from "../services/gemini.js";
import { generateFieldSignature } from "../utils/signature.js";
import { checkAICallQuota } from '../middlewares/quota.js';

const router = express.Router();

router.use(protect)

router.post('/', checkAICallQuota, async (req, res) => {
    try {
        const { ats, fields } = req.body;
        if (!ats || !fields || !Array.isArray(fields) || fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ats(string) and fields(array) are required.",
            })
        }

        const fieldsToProcess = fields.slice(0, 50);

        const classifications = {};
        const cacheMisses = [];

        for (const field of fieldsToProcess) {
            const { label, type = "text" } = field;

            if (!label || typeof label !== "string") continue;

            const mapResult = classifyFromMap(label);
            if (mapResult) {
                classifications[label] = {
                    profileKey: mapResult,
                    source: "map",
                    confidence: 1.0,
                };
            } else {
                cacheMisses.push({ label, type });
            }
        }
        if (cacheMisses.length > 0) {
            const signatures = cacheMisses.map(({ label, type }) =>
                generateFieldSignature(ats, label, type)
            )

            const cacheHits = await FieldCache.find({
                signature: { $in: signatures },
            })

            const cacheMap = {};
            for (const hit of cacheHits) {
                cacheMap[hit.signature] = hit;
            }

            const aiQueue = [];

            for (const { label, type } of cacheMisses) {
                const sig = generateFieldSignature(ats, label, type);
                const cached = cacheMap[sig];

                if (cached) {
                    classifications[label] = {
                        profileKey: cached.profileKey,
                        source: "cache",
                        confidence: cached.confidence,
                    };
                    FieldCache.findByIdAndUpdate(cached._id, {
                        $inc: { hitCount: 1 },
                    }).catch(() => { });

                } else {
                    aiQueue.push({ label, type });
                }
            }

            for (const { label, type } of aiQueue) {
                try {
                    const profileKey = await classifyField(label, ats);
                    const sig = generateFieldSignature(ats, label, type);
                    const confidence = profileKey === "unknown" ? 0.3 : 0.85;

                    classifications[label] = {
                        profileKey,
                        source: "ai",
                        confidence,
                    };

                    await FieldCache.findOneAndUpdate(
                        { signature: sig },
                        {
                            $setOnInsert: {
                                signature: sig,
                                ats,
                                label,
                                profileKey,
                                confidence,
                                hitCount: 1,
                            },
                        },
                        {
                            upsert: true,
                            returnDocument: "after",
                        }
                    );

                } catch (aiErr) {
                    console.error(`AI classification failed for "${label}":`, aiErr.message);
                    classifications[label] = {
                        profileKey: "unknown",
                        source: "ai_error",
                        confidence: 0,
                    };
                }
            }
        }

        const sources = Object.values(classifications).map((c) => c.source);
        const stats = {
            total: sources.length,
            fromMap: sources.filter((s) => s === "map").length,
            fromCache: sources.filter((s) => s === "cache").length,
            fromAI: sources.filter((s) => s === "ai").length,
            fromError: sources.filter((s) => s === "ai_error").length,
        };

        res.json({
            success: true,
            ats,
            classifications,
            stats,
        });

    } catch (err) {
        console.error("Classify fields error:", err);
        res.status(500).json({
            success: false,
            message: "Field classification failed.",
        });
    }
});

export default router;
