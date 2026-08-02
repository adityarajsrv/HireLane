import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not defined.`);
    }
    return value;
};

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 5000,
    FRONTEND_URL: requireEnv("FRONTEND_URL"),
    MONGO_URI: requireEnv("MONGO_URI"),
    JWT_SECRET: requireEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: requireEnv("JWT_EXPIRES_IN") || "7d",
    GEMINI_API_KEY: requireEnv("GEMINI_API_KEY"),
    REDIS_URL: requireEnv("REDIS_URL"),

    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
};

export default config;