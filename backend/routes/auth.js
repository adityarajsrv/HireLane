import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { createAccessToken, createRefreshToken, hashRefreshToken } from "../utils/signature.js";
import { protect } from "../middlewares/authMiddleware.js";
import config from "../config/config.js";

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? "strict" : "lax",
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

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

        user.lastLoginAt = new Date();
        await user.save({ validateBeforeSave: false });

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

export default router;