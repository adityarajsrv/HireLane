import express from "express";
import JDMatchResult from "../models/JDMatchResult.js";
import { protect } from "../middlewares/authMiddleware.js";
import Profile from "../models/Profile.js";

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

    const coverLettersGenerated = results.filter((r) => r.coverLetterGenerated).length;

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
      coverLettersGenerated,
    });
  } catch (err) {
    console.error("JD insights error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch insights." });
  }
});

const COMMON_SKILLS = [
  "kafka", "grpc", "kubernetes", "k8s", "rust", "golang", "go",
  "terraform", "aws", "gcp", "azure", "spark", "flink", "redis",
  "postgresql", "elasticsearch", "graphql", "microservices",
];

router.post("/score", async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.length < 50) {
      return res.status(400).json({ success: false, message: "jobDescription too short to score." });
    }

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile?.skills?.length) {
      return res.status(400).json({ success: false, message: "Upload your resume first." });
    }

    const jdLower = jobDescription.toLowerCase();
    const userSkills = profile.skills;

    const matched = userSkills.filter((s) => jdLower.includes(s.toLowerCase()));
    const missing = COMMON_SKILLS.filter(
      (s) => jdLower.includes(s) && !userSkills.some((us) => us.toLowerCase() === s)
    );

    const total = matched.length + missing.length;
    const score = total > 0 ? Math.round((matched.length / total) * 100) : 65;

    res.json({ success: true, score, matched: matched.slice(0, 8), missing: missing.slice(0, 5) });
  } catch (err) {
    console.error("Score error:", err);
    res.status(500).json({ success: false, message: "Scoring failed." });
  }
});

router.post("/track-cover-view", async (req, res) => {
  try {
    await JDMatchResult.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { coverLetterGenerated: true } },
      { sort: { createdAt: -1 } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;