import User from "../models/User.js";
import UsageQuota from "../models/UsageQuota.js";

const LIMITS = {
    free: {fillsMonth: 15, aiCallsDay: 5},
    pro: {fillsMonth: Infinity, aiCallsDay: Infinity},
}

const getQuota = async (userId) => {
    let quota = await UsageQuota.findOne({ userId });

    if(!quota){
        quota = await UsageQuota.create({ userId });
    }

    const now = new Date();

    if(now>=quota.dayResetAt){
        const nextReset = new Date();
        nextReset.setHours(24,0,0,0);
        quota.aiCallsDay = 0;
        quota.dayResetAt = nextReset;
        await quota.save();
    }

    if(now>=quota.monthResetAt){
        const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        quota.fillsMonth = 0;
        quota.monthResetAt = nextReset;
        await quota.save();
    }

    return quota;
}

export const checkAICallQuota = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const quota = await getQuota(req.user._id);
    const limit = LIMITS[user.plan].aiCallsDay;

    if (quota.aiCallsDay >= limit) {
      return res.status(429).json({
        success: false,
        message: `Daily AI call limit reached (${limit}/day on ${user.plan} plan).`,
        code: "AI_QUOTA_EXCEEDED",
        resetAt: quota.dayResetAt,
      });
    }

    quota.aiCallsDay += 1;
    await quota.save();
    req.quotaRemaining = limit - quota.aiCallsDay;

    next();
  } catch (err) {
    console.error("Quota check error:", err);
    res.status(500).json({ success: false, message: "Quota check failed." });
  }
};

export const checkFillQuota = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const quota = await getQuota(req.user._id);
    const limit = LIMITS[user.plan].fillsMonth;

    if (quota.fillsMonth >= limit) {
      return res.status(429).json({
        success: false,
        message: `Monthly fill limit reached (${limit}/month on ${user.plan} plan). Upgrade to Pro for unlimited fills.`,
        code: "FILL_QUOTA_EXCEEDED",
        resetAt: quota.monthResetAt,
      });
    }

    quota.fillsMonth += 1;
    await quota.save();
    req.quotaRemaining = limit - quota.fillsMonth;
    
    next();
  } catch (err) {
    console.error("Quota check error:", err);
    res.status(500).json({ success: false, message: "Quota check failed." });
  }
};