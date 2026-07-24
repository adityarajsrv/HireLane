import express from "express";
import Application from "../models/Application.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
    try {
        const userId = req.user._id;
        const days = parseInt(req.query.days) || 30;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const funnelData = await Application.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const funnel = { applied: 0, oa: 0, interview: 0, rejected: 0, offer: 0 };
        for (const item of funnelData) {
            if (item._id in funnel) funnel[item._id] = item.count;
        }

        const total = Object.values(funnel).reduce((a, b) => a + b, 0);

        const platformData = await Application.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$ats",
                    total: { $sum: 1 },
                    positive: {
                        $sum: {
                            $cond: [
                                { $in: ["$status", ["oa", "interview", "offer"]] },
                                1, 0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    ats: "$_id",
                    total: 1,
                    positive: 1,
                    conversionRate: {
                        $round: [
                            { $multiply: [{ $divide: ["$positive", "$total"] }, 100] },
                            1,
                        ],
                    },
                },
            },
            { $sort: { conversionRate: -1 } },
        ]);

        const timelineData = await Application.aggregate([
            { $match: { userId, appliedAt: { $gte: since } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" } },
                    count: { $sum: 1 },
                    aiUsed: { $sum: { $cond: [{ $gt: ["$matchScore", 0] }, 1, 0] } },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const responded = funnel.oa + funnel.interview + funnel.offer + funnel.rejected;
        const responseRate = total > 0
            ? Math.round((responded / total) * 100 * 10) / 10
            : 0;

        const aiFilledCount = await Application.countDocuments({
            userId, matchScore: { $gt: 0 },
        });
        const timeSavedHours = Math.round((aiFilledCount * 8 / 60) * 10) / 10;

        const bestPlatform = platformData[0] || null;
        const worstPlatform = platformData[platformData.length - 1] || null;

        res.json({
            success: true,
            period: `${days}d`,
            overview: { total, responseRate, timeSavedHours, aiFilledCount },
            funnel,
            platforms: platformData,
            timeline: timelineData,
            insights: {
                bestPlatform: bestPlatform?.ats || null,
                worstPlatform: worstPlatform?.ats || null,
                conversionGap: bestPlatform && worstPlatform
                    ? Math.round((bestPlatform.conversionRate - worstPlatform.conversionRate) * 10) / 10
                    : 0,
            },
        });
    } catch (err) {
        console.error("Analytics error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch analytics." });
    }
});

export default router;