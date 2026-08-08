import express from "express";
import Profile from "../models/Profile.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";
import { extractTextFromPDF } from "../services/pdf.js";
import { parseResume } from "../services/gemini.js";

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.json({ success: true, profile: null, isNew: true, completeness: 0 });
        }

        const checks = [
            !!profile.firstName,
            !!profile.lastName,
            !!profile.phone,
            !!profile.location,
            !!profile.linkedin,
            profile.skills?.length > 0,
            profile.workExperience?.length > 0,
            profile.education?.length > 0,
            !!profile.gender,
            !!profile.expectedSalary,
            !!profile.noticePeriod,
        ];
        const completeness = Math.round(
            (checks.filter(Boolean).length / checks.length) * 100
        );

        const missingItems = [];
        if (!(profile.workExperience?.length > 0)) missingItems.push("work experience");
        if (!(profile.education?.length > 0)) missingItems.push("education");
        if (!profile.gender) missingItems.push("EEO preferences");
        if (!profile.expectedSalary) missingItems.push("salary expectations");

        res.json({ success: true, profile, completeness, missingItems });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
});

const EDITABLE_FIELDS = [
    "firstName",
    "lastName",
    "phone",
    "location",
    "linkedin",
    "github",
    "portfolio",
    "workAuth",
    "expectedSalary",
    "noticePeriod",
    "targetRoles",
    "workExperience",
    "education",
    "gender",
    "ethnicity",
    "veteranStatus",
    "disabilityStatus",
    "extensionEnabled",
    "onboardingCompleted",
    "dateOfBirth",
    "currentSalary",
    "sponsorshipRequired",
    "eligibleToWork",
    "backgroundCheckConsent",
    "drugTestConsent",
    "willingToRelocate",
    "willingToTravel",
    "earliestStartDate",
    "certifications",
];

router.put("/", async (req, res) => {
    try {
        const updateData = {};

        for (const field of EDITABLE_FIELDS) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update.",
            });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            { $set: updateData },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true,
            }
        );

        res.json({ success: true, profile });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(". "),
            });
        }

        console.error("Update profile error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update profile.",
        });
    }
});

router.post("/resume", upload.single("resume"), async (req, res) => {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("req.headers['content-type']:", req.headers['content-type']);
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded. Please attach a PDF.",
            });
        }

        const resumeText = await extractTextFromPDF(req.file.buffer);
        const parsed = await parseResume(resumeText);

        const profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            {
                $set: {
                    firstName: parsed.firstName || "",
                    lastName: parsed.lastName || "",
                    phone: parsed.phone || "",
                    location: parsed.location || "",
                    linkedin: parsed.linkedin || "",
                    github: parsed.github || "",
                    portfolio: parsed.portfolio || "",
                    skills: parsed.skills || [],
                    cvBullets: parsed.cvBullets || [],
                    targetRoles: parsed.targetRoles || [],
                    workExperience: parsed.workExperience || [],
                    education: parsed.education || [],
                    resumeText,
                    resumeFileName: req.file.originalname,
                    resumeUploadedAt: new Date(),
                },
            },
            { returnDocument: "after", upsert: true }
        );
        res.json({
            success: true,
            message: "Resume parsed successfully.",
            profile,
            extracted: {
                name: `${parsed.firstName} ${parsed.lastName}`.trim(),
                skillsCount: parsed.skills?.length || 0,
                bulletsCount: parsed.cvBullets?.length || 0,
            },
        });
    } catch (err) {
        console.error("Resume upload error DETAILS:", err);

        if (err.message?.includes("Only PDF")) {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (err.message?.includes("Could not extract")) {
            return res.status(422).json({ success: false, message: err.message });
        }
        if (err instanceof SyntaxError) {
            return res.status(502).json({
                success: false,
                message: "AI parsing failed. Please try again.",
            });
        }
        console.error("Resume upload error:", err);
        res.status(500).json({ success: false, message: "Resume processing failed." });
    }
})

export default router;