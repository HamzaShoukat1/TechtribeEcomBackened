import mongoose from "mongoose";
import { DB_NAME } from "../constaints.js";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        if (!process.env.MONGODB_URL) {
            console.error("MONGODB_URL is not defined in environment variables");
            return;
        }
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`/MONGOdb connected !! db host:${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("mongodb connection failed ", error);
        throw error;
    }

}
export default connectDB



