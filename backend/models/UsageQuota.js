import mongoose from "mongoose";

const usageQuotaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    fillsMonth: {
      type: Number,
      default: 0,
    },
    aiCallsDay: {
      type: Number,
      default: 0,
    },
    monthResetAt: {
      type: Date,
      default: () => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth() + 1, 1);
      },
    },
    dayResetAt: {
      type: Date,
      default: () => {
        const d = new Date();
        d.setHours(24, 0, 0, 0);
        return d;
      },
    },
  },
  { timestamps: true }
);

const UsageQuota = mongoose.model("UsageQuota", usageQuotaSchema);

export default UsageQuota;