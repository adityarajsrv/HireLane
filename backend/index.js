import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import classifyRoutes from "./routes/classify.js";
import coverRoutes from "./routes/cover.js";
import applicationRoutes from "./routes/applications.js";
import analyticsRoutes from "./routes/analytics.js";
import quotaRoutes from "./routes/quota.js";
import jdMatchRoutes from "./routes/jdmatch.js";
import passport from "./config/passport.js";
import contactRoutes from "./routes/contact.js";

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"], 
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (origin === config.FRONTEND_URL) {
      return callback(null, true);
    }

    if (
      config.isProd &&
      config.EXTENSION_ID &&
      origin === `chrome-extension://${config.EXTENSION_ID}`
    ) {
      return callback(null, true);
    }

    if (config.isDev && origin.startsWith("chrome-extension://")) {
      return callback(null, true);
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(passport.initialize());

if (config.isDev) {
    app.use(morgan("dev"));
}

app.get("/health", (_, res) => res.json({ status: "ok", ts: Date.now() }));

app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/classify-fields", classifyRoutes);
app.use("/api/generate-cover", coverRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/quota", quotaRoutes);
app.use("/api/jdmatch", jdMatchRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
})

app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(err.status || 500).json({
        success: false,
        message: config.isProd ? "Internal Server Error" : err.message,
    });
})

const start = async () => {
    await connectDB();
    app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT} [${config.NODE_ENV}]`);
    });
}

start();