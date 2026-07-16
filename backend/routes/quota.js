import express from "express";
import User from "../models/User.js";
import UsageQuota from "../models/UsageQuota.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

const LIMITS = {
  free: { fillsMonth: 15, aiCallsDay: 5 },
  pro:  { fillsMonth: "unlimited", aiCallsDay: "unlimited" },
};

router.get("/", async (req, res) => {
  const user = await User.findById(req.user._id);
  let quota = await UsageQuota.findOne({ userId: req.user._id });

  if (!quota) {
    quota = await UsageQuota.create({ userId: req.user._id });
  }

  const limit = LIMITS[user.plan];

  res.json({
    success: true,
    plan: user.plan,
    fillsUsed: quota.fillsMonth,
    fillsLimit: limit.fillsMonth,
    aiCallsUsed: quota.aiCallsDay,
    aiCallsLimit: limit.aiCallsDay,
    monthResetAt: quota.monthResetAt,
    dayResetAt: quota.dayResetAt,
  });
});

export default router;