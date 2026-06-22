import mongoose from 'mongoose';
import config from '../config/config.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGO_URI, { 
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        process.on("SIGTERM", async () => {
            await mongoose.connection.close();
            console.log("MongoDB disconnected on SIGTERM");
            process.exit(0);
        });
    } catch (err) {
        console.error(`MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
};

export { connectDB };