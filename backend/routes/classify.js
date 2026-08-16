import express from 'express';
import FieldCache from '../models/FieldCache.js';
import { protect } from '../middlewares/authMiddleware.js';
import { classifyFromMap } from "../services/fieldMap.js";
import { classifyField } from "../services/gemini.js";
import { generateFieldSignature } from "../utils/signature.js";
import { checkAICallQuotaRedis } from '../middlewares/quota.js';
import redis from "../config/redis.js";
import { aiLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

router.use(protect)

router.post('/', aiLimiter, checkAICallQuotaRedis, async (req, res) => {
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
            const redisKeys = cacheMisses.map(({ label, type }) =>
                `field:${generateFieldSignature(ats, label, type)}`
            );

            const redisResults =
                redisKeys.length > 0
                    ? await redis.mget(redisKeys)
                    : [];

            const stillMissing = [];

            redisResults.forEach((cached, i) => {
                if (cached) {
                    const parsed = JSON.parse(cached);

                    classifications[cacheMisses[i].label] = {
                        profileKey: parsed.profileKey,
                        source: "redis",
                        confidence: parsed.confidence,
                    };
                } else {
                    stillMissing.push(cacheMisses[i]);
                }
            });

            const signatures = stillMissing.map(({ label, type }) =>
                generateFieldSignature(ats, label, type)
            );

            const cacheHits = await FieldCache.find({
                signature: { $in: signatures },
            });

            const cacheMap = {};
            for (const hit of cacheHits) {
                cacheMap[hit.signature] = hit;
            }

            const aiQueue = [];

            for (const { label, type } of stillMissing) {
                const sig = generateFieldSignature(ats, label, type);
                const cached = cacheMap[sig];

                if (cached) {
                    classifications[label] = {
                        profileKey: cached.profileKey,
                        source: "cache",
                        confidence: cached.confidence,
                    };

                    await redis.set(
                        `field:${sig}`,
                        JSON.stringify({
                            profileKey: cached.profileKey,
                            confidence: cached.confidence,
                        }),
                        "EX",
                        60 * 60 * 24 * 7
                    );

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

                    await redis.set(
                        `field:${sig}`,
                        JSON.stringify({
                            profileKey,
                            confidence,
                        }),
                        "EX",
                        60 * 60 * 24 * 7
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
            fromRedis: sources.filter((s) => s === "redis").length,
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
