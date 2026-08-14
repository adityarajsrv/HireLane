import mongoose from "mongoose";

const jdMatchResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company:  { type: String, default: "" },
    role:     { type: String, default: "" },
    score:    { type: Number, required: true },
    matched:  [{ type: String }],
    missing:  [{ type: String }],
    coverLetterGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const JDMatchResult = mongoose.model("JDMatchResult", jdMatchResultSchema);
export default JDMatchResult;