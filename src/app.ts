

import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./Routes/AuthRoutes.js";
import dotenv from "dotenv";
import path from "path";
import ProductRoutes from "./Routes/ProductRoutes.js";
import CartRoutes from "./Routes/CartRoutes.js"
import { errorHandler } from "./Middlewares/error.middleware.js";
import paymentRoutes from "./Routes/paymentRoutes.js"
import OrdersRoutes from "./Routes/OrderRoutes.js"
import ContactRoutes from "./Routes/ContactRoute.js"
import ReviewRoutes from "./Routes/ReviewRoutes.js"
import uploadRoutes from "./Routes/uploadRoutes.js"
import StatsRoutes from "./Routes/State.Routes.js"
import { apiLimiter } from "./Middlewares/rate.Limitter.js";
dotenv.config({ path: "backened/.env" });

dotenv.config();

const app = express();
app.use(apiLimiter)


// Middleware
app.use(cors({
  origin: ["http://localhost:3000",],
  credentials: true
}))

app.use(cookieParser());

app.use("/payment", paymentRoutes)

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve assets properly
app.use("/assets", express.static(path.join(process.cwd(), "backened", "Public", "assets")));

app.set("trust proxy", 1); // trust first proxy (Railway load balancer)
// app.use(limiter)




// API routes
app.use("/auth", AuthRoutes);
app.use("/product", ProductRoutes)
app.use("/cart", CartRoutes)
app.use("/AllOrders", OrdersRoutes)
app.use("/order", OrdersRoutes)
app.use("/review", ReviewRoutes)
app.use("/contact", ContactRoutes)
app.use("/dashboard", StatsRoutes)
app.use("/upload", uploadRoutes)
// app.use("/payment", paymentRoutes).


// Error handler

// Production frontend
// if (process.env.NODE_ENV === "production") {
//     const frontendPath = path.join(process.cwd(), "fronted", "dist");
//     app.use(express.static(frontendPath));


// app.get(/.*/, (_req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
// });

// }
// app.use(errorHandler);
app.use(errorHandler);

export { app };