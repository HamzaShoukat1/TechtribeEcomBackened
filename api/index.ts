/// <reference path="../src/types/express.d.ts" />
import { app } from "../src/app.js";
import connectDB from "../src/db/db.js";

// Connect to database on serverless cold start
connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
});

export default app;
