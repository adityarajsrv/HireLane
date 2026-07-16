import express from "express";
import Application from "../models/Application.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
    try {
        const { status, limit, ats } = req.query;
        const filter = { userId: req.user._id };

        if (status) filter.status = status;
        if (ats) filter.ats = ats;

        let query = Application
            .find(filter)
            .sort({ appliedAt: -1 });

        if (limit) query = query.limit(parseInt(limit));

        const applications = await query;
        res.json({
            success: true,
            count: applications.length,
            applications,
        });
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
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            })
        }

        res.json({ success: true, application });
    } catch (err) {
        console.error("Get application error", err);
        res.status(500).json({ success: false, message: "Failed to fetch application." });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            company, role, ats, url,
            coverLetter, matchScore, notes,
            deadline, appliedAt,
        } = req.body;

        if (!company || !role) {
            return res.status(400).json({
                success: false,
                message: "Company and role are required.",
            });
        }

        const application = await Application.create({
            userId: req.user._id,
            company,
            role,
            ats: ats || "other",
            url: url || "",
            coverLetter: coverLetter || "",
            matchScore: matchScore || null,
            notes: notes || "",
            deadline: deadline || null,
            appliedAt: appliedAt || new Date(),
            status: "applied",
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
            return res.status(400).json({
                success: false,
                message: "No valid fields to update.",
            })
        }

        const application = await Application.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user._id, 
            },
            { $set: updates },
            { returnDocument: "after", runValidators: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found.",
            });
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
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }
    res.json({
      success: true,
      message: "Application deleted.",
    });
  } catch (err) {
    console.error("Delete application error:", err);
    res.status(500).json({ success: false, message: "Failed to delete application." });
  }
});

export default router;