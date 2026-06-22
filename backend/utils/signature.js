import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/config.js";

const createAccessToken = (user) => {
  const payload = {
    id:    user._id.toString(),
    email: user.email,
    plan:  user.plan,
  };

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "15m",       
    algorithm: "HS256",
    issuer: "hirelane-api",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: "hirelane-api",
  });
};

const createRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex"); 
};

const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export {
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
  hashRefreshToken,
};