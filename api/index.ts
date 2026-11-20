/// <reference path="../src/types/express.d.ts" />
import { app } from "../src/app.js";
import connectDB from "../src/db/db.js";

// Ensure DB is connected for serverless invocations
connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
});

export default app;
