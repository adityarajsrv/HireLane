import mongoose from "mongoose";

const coverLetterLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: { type: String, default: "" },
    role:    { type: String, default: "" },
    source: {
      type: String,
      enum: ["web", "extension"],
      required: true,
    },
    matchScore: { type: Number, default: null },
  },
  { timestamps: true }
);

const CoverLetterLog = mongoose.model("CoverLetterLog", coverLetterLogSchema);
export default CoverLetterLog;