import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(helmet());

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}))

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (config.isDev) {
    app.use(morgan("dev"));
}

app.get("/health", (_, res) => res.json({ status: "ok", ts: Date.now() }));

app.use("/auth", authRoutes);

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
        message: env.isProd ? "Internal Server Error" : err.message,
    });
})

const start = async () => {
    await connectDB();
    app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT} [${config.NODE_ENV}]`);
    });
}

start();