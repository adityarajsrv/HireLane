const requireEnv = (key) => {
    const value = import.meta.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

const env = {
    VITE_API_URL: requireEnv("VITE_API_URL"),
    MODE: import.meta.env.MODE,

    isDev: import.meta.env.MODE === "development",
    isProd: import.meta.env.MODE === "production",
};

export default env;