import express from "express";
import Profile from "../models/Profile.js";
import { protect } from "../middlewares/authMiddleware.js";
import { generateCoverLetter } from "../services/gemini.js";
import { checkAICallQuota } from "../middlewares/quota.js";

const router = express.Router();
router.use(protect);

router.post("/", checkAICallQuota, async (req, res) => {
    try {
        const { jobDescription, company, role } = req.body;

        if (!jobDescription || !company || !role) {
            return res.status(400).json({
                success: false,
                message: "jobDescription, company and role are required."
            })
        }

        const profile = await Profile.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(400).json({
                success: false,
                message: "Please upload your resume first before generating a cover letter.",
            });
        }

        if (!profile.cvBullets || profile.cvBullets.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No CV bullets found. Please re-upload your resume.",
            });
        }

        const coverLetter = await generateCoverLetter({
            jobDescription,
            company,
            role,
            cvBullets: profile.cvBullets,
        });

        res.json({
            success: true,
            coverLetter,
            wordCount: coverLetter.split(/\s+/).length,
        });
    }catch(err){
        if(err.status===429){
            return res.status(429).json({
                success: false,
                message: "AI quota exceeded. Please wait and try again.",
                code: "QUOTA_EXCEEDED",
            });
        }
        console.error("Cover letter error: ", err);
        res.status(500).json({
            success: false,
            message: "Cover letter generation failed.",
        });
    }
});

export default router;
