import User from "../models/User.js";
import UsageQuota from "../models/UsageQuota.js";
import redis from "../config/redis.js";

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

export const checkAICallQuotaRedis = async (req, res, next) => {
  try {
    const user = req.user;
    const limit = user.plan === "pro" ? Infinity : 5;

    if (limit === Infinity) return next();

    const today = new Date().toISOString().slice(0, 10); 
    const key = `quota:ai:${user._id}:${today}`;
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, 60 * 60 * 24);
    }

    if (count > limit) {
      return res.status(429).json({
        success: false,
        message: `Daily AI call limit reached (${limit}/day on free plan).`,
        code: "AI_QUOTA_EXCEEDED",
      });
    }

    req.quotaRemaining = limit - count;
    next();
  } catch (err) {
    console.error("Redis quota check error:", err);
    next();
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