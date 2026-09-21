import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import AuthRoutes from "./Routes/AuthRoutes.js";
import ProductRoutes from "./Routes/ProductRoutes.js";
import CartRoutes from "./Routes/CartRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";
import OrdersRoutes from "./Routes/OrderRoutes.js";
import ContactRoutes from "./Routes/ContactRoute.js";
import ReviewRoutes from "./Routes/ReviewRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import StatsRoutes from "./Routes/State.Routes.js";

import { errorHandler } from "./Middlewares/error.middleware.js";
import { apiLimiter } from "./Middlewares/rate.Limitter.js";

dotenv.config();

const app = express();

/*
|--------------------------------------------------------------------------
| Trust Railway Proxy
|--------------------------------------------------------------------------
*/

app.set("trust proxy", 1);


/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean) as string[];


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // Example: Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }


      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


/*
|--------------------------------------------------------------------------
| Rate Limiter
|--------------------------------------------------------------------------
|
| CORS must be registered BEFORE the rate limiter so that
| browser OPTIONS/preflight requests are handled correctly.
|
*/

app.use(apiLimiter);


/*
|--------------------------------------------------------------------------
| Cookies
|--------------------------------------------------------------------------
*/

app.use(cookieParser());


/*
|--------------------------------------------------------------------------
| Stripe Payment Routes
|--------------------------------------------------------------------------
|
| Keep this BEFORE express.json() if your Stripe webhook
| requires the raw request body.
|
*/

app.use("/payment", paymentRoutes);


/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);


/*
|--------------------------------------------------------------------------
| Static Files
|--------------------------------------------------------------------------
*/

app.use(
  "/assets",
  express.static(
    path.join(process.cwd(), "Public", "assets")
  )
);


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/auth", AuthRoutes);

app.use("/product", ProductRoutes);

app.use("/cart", CartRoutes);

app.use("/AllOrders", OrdersRoutes);

app.use("/order", OrdersRoutes);

app.use("/review", ReviewRoutes);

app.use("/contact", ContactRoutes);

app.use("/dashboard", StatsRoutes);

app.use("/upload", uploadRoutes);




app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TechTribe backend is running",
    environment: process.env.NODE_ENV || "development",
  });
});


/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);


export { app };