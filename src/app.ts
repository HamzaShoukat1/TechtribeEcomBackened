import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./Routes/AuthRoutes.js";
import dotenv from "dotenv";
import path from "path";
import ProductRoutes from "./Routes/ProductRoutes.js";
import CartRoutes from "./Routes/CartRoutes.js";
import { errorHandler } from "./Middlewares/error.middleware.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import OrdersRoutes from "./Routes/OrderRoutes.js";
import ContactRoutes from "./Routes/ContactRoute.js";
import ReviewRoutes from "./Routes/ReviewRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import StatsRoutes from "./Routes/State.Routes.js";
import { apiLimiter } from "./Middlewares/rate.Limitter.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1); // Trust Railway's reverse proxy

app.use(apiLimiter);

// Allowed origins for CORS (Production Frontend + Local Dev)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked this request"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

// Stripe Webhook (placed before express.json if handling raw bodies)
app.use("/payment", paymentRoutes);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static files directory
app.use("/assets", express.static(path.join(process.cwd(), "Public", "assets")));

// API routes
app.use("/auth", AuthRoutes);
app.use("/product", ProductRoutes);
app.use("/cart", CartRoutes);
app.use("/AllOrders", OrdersRoutes);
app.use("/order", OrdersRoutes);
app.use("/review", ReviewRoutes);
app.use("/contact", ContactRoutes);
app.use("/dashboard", StatsRoutes);
app.use("/upload", uploadRoutes);

// Global Error Handler
app.use(errorHandler);

export { app };