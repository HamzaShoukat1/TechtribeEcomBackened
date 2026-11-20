import { app } from "./app.js";
import connectDB from "./db/db.js";

// Connect to DB on cold start (safe — idempotent)
connectDB().catch((err) => {
  console.error("[Vercel] MongoDB connection failed:", err);
});

export default app;
