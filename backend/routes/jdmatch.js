import express from "express";
import JDMatchResult from "../models/JDMatchResult.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/", async (req, res) => {
  try {
    const { company, role, score, matched, missing } = req.body;
    if (typeof score !== "number") {
      return res.status(400).json({ success: false, message: "score is required." });
    }
    const result = await JDMatchResult.create({
      userId: req.user._id,
      company: company || "",
      role:    role    || "",
      score,
      matched: matched || [],
      missing: missing || [],
    });
    res.status(201).json({ success: true, result });
  } catch (err) {
    console.error("Save JD match error:", err);
    res.status(500).json({ success: false, message: "Failed to save result." });
  }
});

router.get("/insights", async (req, res) => {
  try {
    const userId = req.user._id;

    const results = await JDMatchResult.find({ userId }).sort({ createdAt: -1 });

    if (results.length === 0) {
      return res.json({
        success: true,
        totalAnalyzed: 0,
        avgScore: 0,
        topMissingSkills: [],
        recent: [],
      });
    }

    const avgScore = Math.round(
      results.reduce((sum, r) => sum + r.score, 0) / results.length
    );

    const missingCounts = {};
    results.forEach((r) => {
      r.missing.forEach((skill) => {
        missingCounts[skill] = (missingCounts[skill] || 0) + 1;
      });
    });

    const topMissingSkills = Object.entries(missingCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([skill, count]) => ({
        skill,
        count,
        pct: Math.round((count / results.length) * 100),
      }));

    res.json({
      success: true,
      totalAnalyzed: results.length,
      avgScore,
      topMissingSkills,
      recent: results.slice(0, 5).map((r) => ({
        company: r.company,
        role: r.role,
        score: r.score,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    console.error("JD insights error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch insights." });
  }
});

export default router;