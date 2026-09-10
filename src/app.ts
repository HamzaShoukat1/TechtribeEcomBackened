

import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./Routes/AuthRoutes.js";
// import UserRoutes from "./Routes/User.Routes.js";
// import PostRoutes from "./Routes/Post.Routes.js";
// import NotificationRoutes from "./Routes/Notification.Routes.js";
// import { errorHandler } from "./Middlewares/error.middleware.js";
// import { limiter } from "./Middlewares/express.ratelimit.js";
import dotenv from "dotenv";
import path from "path";
import ProductRoutes from "./Routes/ProductRoutes.js";
import CartRoutes from "./Routes/CartRoutes.js"
import { errorHandler } from "./Middlewares/error.middleware.js";
import paymentRoutes from "./Routes/paymentRoutes.js"
dotenv.config({ path: "backened/.env" });
dotenv.config();

const app = express();


// Middleware
app.use(cors({
  origin: ["http://localhost:3000",],
  credentials: true
}))

app.use("/payment", express.raw({ type: 'application/json' }), paymentRoutes)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve assets properly
app.use("/assets", express.static(path.join(process.cwd(), "backened", "Public", "assets")));
app.use(cookieParser());

app.set("trust proxy", 1); // trust first proxy (Railway load balancer)
// app.use(limiter)




// API routes
app.use("/auth", AuthRoutes);
app.use("/product", ProductRoutes)
app.use("/cart", CartRoutes)
// app.use("/payment", paymentRoutes)


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