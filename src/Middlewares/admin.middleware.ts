import type { Request, Response, NextFunction } from "express";
import { Apierror } from "../utils/ApiError.js";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "ADMIN") {
    throw new Apierror(403, "Access denied. Admin only.");
  }

  next();
};