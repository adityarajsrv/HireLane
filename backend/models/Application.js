import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
        },
        ats: {
            type: String,
            enum: ["workday", "greenhouse", "internshala", "naukri", "wellfound", "other"],
            default: "other",
        },
        url: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["applied", "oa", "interview", "rejected", "offer"],
            default: "applied",
        },
        coverLetter: {
            type: String,
            default: "",
        },
        matchScore: {
            type: Number,
            default: null,
            min: 0,
            max: 100,
        },
        notes: {
            type: String,
            default: "",
        },
        deadline: {
            type: Date,
            default: null,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        expectedCTC: {
            type: Number,
            default: null
        },
        sessionKey: {
            type: String,
            default: null,
            index: true,
        },
    },
    { timestamps: true }
);

applicationSchema.index({ userId: 1, appliedAt: -1 });
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, sessionKey: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;