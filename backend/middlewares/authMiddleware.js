import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyAccessToken } from "../utils/signature.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated, please login",
        code: "NO_TOKEN",
      });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Session expired, please login again",
          code: "TOKEN_EXPIRED", 
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        code: "TOKEN_INVALID",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
        code: "USER_INACTIVE",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("protect middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Authentication check failed.",
    });
  }
};

const requirePro = (req, res, next) => {
  if (req.user?.plan !== "pro") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Pro plan required.",
      code: "PRO_PLAN_REQUIRED",
    });
  }
  next();
};

export { protect, requirePro };