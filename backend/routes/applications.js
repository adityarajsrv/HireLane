import express from "express";
import Application from "../models/Application.js";
import { protect } from "../middlewares/authMiddleware.js";
import redis from "../config/redis.js";

const router = express.Router();
router.use(protect);

const VALID_STATUSES = ["applied", "oa", "interview", "rejected", "offer"];

router.get("/", async (req, res) => {
  try {
    const { status, limit, ats, sessionKey } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (ats) filter.ats = ats;
    if (sessionKey) filter.sessionKey = sessionKey;

    let query = Application.find(filter).sort({ appliedAt: -1 });
    if (limit) query = query.limit(parseInt(limit));

    const applications = await query;
    res.json({ success: true, count: applications.length, applications });
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch applications." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }
    res.json({ success: true, application });
  } catch (err) {
    console.error("Get application error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch application." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      company, role, ats, url,
      coverLetter, matchScore, notes,
      deadline, appliedAt, status, sessionKey,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: "Company and role are required." });
    }

    if (sessionKey) {
      const redisKey = `session:${req.user._id}:${sessionKey}`;
      const cachedAppId = await redis.get(redisKey);

      if (cachedAppId) {
        const existing = await Application.findById(cachedAppId);

        if (existing) {
          if (company) existing.company = company;
          if (role) existing.role = role;
          if (ats) existing.ats = ats;
          if (url) existing.url = url;
          if (coverLetter) existing.coverLetter = coverLetter;
          if (matchScore != null) existing.matchScore = matchScore;

          await existing.save();

          return res.status(200).json({
            success: true,
            application: existing,
            deduped: true,
          });
        }
      }

      const existing = await Application.findOne({
        userId: req.user._id,
        sessionKey,
      });

      if (existing) {
        if (company) existing.company = company;
        if (role) existing.role = role;
        if (ats) existing.ats = ats;
        if (url) existing.url = url;
        if (coverLetter) existing.coverLetter = coverLetter;
        if (matchScore != null) existing.matchScore = matchScore;

        await existing.save();

        await redis.set(
          redisKey,
          existing._id.toString(),
          "EX",
          60 * 60 * 2
        );

        return res.status(200).json({
          success: true,
          application: existing,
          deduped: true,
        });
      }
    }

    const existingCount = await Application.countDocuments({ userId: req.user._id });
    if (req.user.plan === "free" && existingCount >= FREE_APPLICATION_LIMIT) {
      return res.status(403).json({
        success: false,
        message: `Free plan limit reached (${FREE_APPLICATION_LIMIT} applications). Upgrade to Pro for unlimited tracking.`,
        code: "APPLICATION_LIMIT_REACHED",
      });
    }

    const finalStatus = VALID_STATUSES.includes(status) ? status : "applied";

    const application = await Application.create({
      userId: req.user._id,
      company, role,
      ats: ats || "other",
      url: url || "",
      coverLetter: coverLetter || "",
      matchScore: matchScore || null,
      notes: notes || "",
      deadline: deadline || null,
      appliedAt: appliedAt || new Date(),
      status: finalStatus,
      sessionKey: sessionKey || null,
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Create application error:", err);
    res.status(500).json({ success: false, message: "Failed to create application." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { status, notes, deadline, coverLetter, matchScore } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (deadline !== undefined) updates.deadline = deadline;
    if (coverLetter !== undefined) updates.coverLetter = coverLetter;
    if (matchScore !== undefined) updates.matchScore = matchScore;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update." });
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }
    res.json({ success: true, application });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(". ") });
    }
    console.error("Update application error:", err);
    res.status(500).json({ success: false, message: "Failed to update application." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }
    res.json({ success: true, message: "Application deleted." });
  } catch (err) {
    console.error("Delete application error:", err);
    res.status(500).json({ success: false, message: "Failed to delete application." });
  }
});

const FREE_APPLICATION_LIMIT = 20;

export default router;