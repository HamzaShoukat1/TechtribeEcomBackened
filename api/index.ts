/// <reference path="../src/types/express.d.ts" />
import { app } from "../src/app.js";
import connectDB from "../src/db/db.js";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (err) {
    console.error("MongoDB connection error in serverless handler:", err);
  }
  return app(req, res);
}
