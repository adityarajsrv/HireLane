import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { createAccessToken, createRefreshToken, hashRefreshToken } from "../utils/signature.js";
import { protect } from "../middlewares/authMiddleware.js";
import config from "../config/config.js";
import Profile from "../models/Profile.js";
import Application from "../models/Application.js";
import JDMatchResult from "../models/JDMatchResult.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import passport from "../config/passport.js";
import Otp from "../models/Otp.js";
import { generateOtp, hashOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../services/email.js";
import { otpLimiter } from "../middlewares/rateLimit.js";
import PairingCode from "../models/PairingCode.js";
import crypto from "crypto";

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? "none" : "lax",
}

const refresh_token_days = 7

const issueSession = async (res, user, req) => {
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(Date.now() + refresh_token_days * 24 * 60 * 60 * 1000);

    await Session.create({
        userId: user._id,
        refreshTokenHash,
        deviceType: "web",
        userAgent: req.headers['user-agent'] || null,
        ip: req.ip,
        expiresAt,
    })

    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: refresh_token_days * 24 * 60 * 60 * 1000, path: "/auth/refresh" });
}

router.post("/register", authLimiter, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            })
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        const user = await User.create({ name, email, password, provider: "email" });

        await issueSession(res, user, req);

        res.status(201).json({ success: true, user });

    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(". ") });
        }
        console.error("Register error:", err);
        res.status(500).json({ success: false, message: "Registration failed." });
    }
});

router.post("/login", authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");


        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        if (user.provider !== "email") {
            return res.status(400).json({
                success: false,
                message: "This account uses Google sign-in. Please continue with Google.",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        await User.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date(),
        });

        await issueSession(res, user, req);

        res.json({ success: true, user });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Login failed." });
    }
});

router.post("/refresh", async (req, res) => {
    try {
        const incomingToken = req.cookies?.refreshToken;

        if (!incomingToken) {
            return res.status(401).json({ success: false, message: "No refresh token provided", code: "NO_REFRESH_TOKEN" });
        }
        const incomingHash = hashRefreshToken(incomingToken);

        const session = await Session.findOne({ refreshTokenHash: incomingHash });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired session. Please log in again.",
                code: "REFRESH_INVALID",
            });
        }

        if (session.expiresAt < new Date()) {
            await session.deleteOne();
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
                code: "REFRESH_EXPIRED",
            });
        }

        const user = await User.findById(session.userId);
        if (!user || !user.isActive) {
            await session.deleteOne();
            return res.status(401).json({ success: false, message: "User not found or inactive." });
        }

        await session.deleteOne();
        await issueSession(res, user, req);

        res.json({ success: true, message: "Session refreshed." });

    } catch (err) {
        console.error("Refresh error:", err);
        res.status(500).json({ success: false, message: "Could not refresh session." });
    }
});

router.get("/me", protect, async (req, res) => {
    res.json({ success: true, user: req.user });
});

router.post("/logout", protect, async (req, res) => {
    const incomingToken = req.cookies?.refreshToken;

    if (incomingToken) {
        const hash = hashRefreshToken(incomingToken);
        await Session.deleteOne({ refreshTokenHash: hash });
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", { ...cookieOptions, path: "/auth/refresh" });

    res.json({ success: true, message: "Logged out successfully." });
});

router.post("/logout-all", protect, async (req, res) => {
    await Session.deleteMany({ userId: req.user._id });

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", { ...cookieOptions, path: "/auth/refresh" });

    res.json({ success: true, message: "Logged out from all devices." });
});


router.post("/extension-token", protect, async (req, res) => {
  const token = createAccessToken(req.user);

  await Profile.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { extensionLastConnectedAt: new Date() } },
    { upsert: true }
  );

  res.json({ success: true, token, user: req.user });
});

router.delete("/account", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    await Promise.all([
      Session.deleteMany({ userId }),
      Profile.deleteOne({ userId }),
      Application.deleteMany({ userId }),
      JDMatchResult.deleteMany({ userId }),
    ]);

    await User.findByIdAndDelete(userId);

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", { ...cookieOptions, path: "/auth/refresh" });

    res.json({ success: true, message: "Account deleted." });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ success: false, message: "Failed to delete account." });
  }
});

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
}));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${config.FRONTEND_URL}/auth?error=google_failed` }),
  async (req, res) => {
    const user = req.user;
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    await Session.create({
      userId: user._id,
      refreshTokenHash,
      deviceType: "web",
      userAgent: req.headers["user-agent"] || null,
      ip: req.ip,
      expiresAt: new Date(Date.now() + refresh_token_days * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: refresh_token_days * 24 * 60 * 60 * 1000, path: "/auth/refresh" });

    res.redirect(`${config.FRONTEND_URL}/dashboard`);
  }
);

router.post("/send-verify-otp", otpLimiter, protect, async (req, res) => {
  if (req.user.isVerified) {
    return res.json({ success: true, message: "Already verified." });
  }
  const otp = generateOtp();
  await Otp.create({
    email: req.user.email,
    codeHash: hashOtp(otp),
    purpose: "verify_email",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  await sendOtpEmail(req.user.email, otp, "verify");
  res.json({ success: true, message: "Verification code sent." });
});

router.post("/verify-email", protect, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, message: "Code is required." });

  const record = await Otp.findOne({
    email: req.user.email,
    purpose: "verify_email",
    codeHash: hashOtp(code),
  });

  if (!record) {
    return res.status(400).json({ success: false, message: "Invalid or expired code." });
  }

  await User.findByIdAndUpdate(req.user._id, { isVerified: true });
  await record.deleteOne(); 
  res.json({ success: true, message: "Email verified." });
});

router.post("/forgot-password", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.provider !== "email") {
      return res.json({ success: true, message: "If that email exists, a code has been sent." });
    }

    const otp = generateOtp();
    await Otp.create({
      email: user.email,
      codeHash: hashOtp(otp),
      purpose: "reset_password",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    try {
      await sendOtpEmail(user.email, otp, "reset");
    } catch (emailErr) {
      console.error("[forgot-password] Email send failed:", emailErr.message);
    }

    res.json({ success: true, message: "If that email exists, a code has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

router.post("/reset-password", otpLimiter, async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const record = await Otp.findOne({
      email: email.toLowerCase(),
      purpose: "reset_password",
      codeHash: hashOtp(code),
    });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired code." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired code." });
    }

    user.password = newPassword;
    await user.save(); 
    await record.deleteOne();
    await Session.deleteMany({ userId: user._id }); 

    res.json({ success: true, message: "Password reset successfully. Please log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

router.post("/extension-pair/generate", protect, async (req, res) => {
  const code = crypto.randomInt(100000, 999999).toString();

  await PairingCode.create({
    userId: req.user._id,
    code,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  res.json({ success: true, code });
});

router.post("/extension-pair/redeem", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, message: "Code is required." });

  const record = await PairingCode.findOne({ code });
  if (!record) {
    return res.status(400).json({ success: false, message: "Invalid or expired code." });
  }

  const user = await User.findById(record.userId);
  if (!user || !user.isActive) {
    return res.status(400).json({ success: false, message: "User not found." });
  }

  await record.deleteOne();

  const token = createAccessToken(user);
  await Profile.findOneAndUpdate(
    { userId: user._id },
    { $set: { extensionLastConnectedAt: new Date() } },
    { upsert: true }
  );

  res.json({ success: true, token, user });
});

export default router;

