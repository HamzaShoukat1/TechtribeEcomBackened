import mongoose from "mongoose";
import { DB_NAME } from "../constaints.js";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }
        // Using { dbName } avoids any double-slash or query-string formatting bugs
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: DB_NAME,
        });
        console.log(`MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
};

export default connectDB;
