/// <reference path="../src/types/express.d.ts" />
import { app } from "../src/app.js";
import connectDB from "../src/db/db.js";

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      errors: [],
      data: null,
    });
  }
});

export default app;
