import { Router } from "express";


import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { verifyAdmin } from "../Middlewares/admin.middleware.js";
import { getDashboardStats } from "../Controllers/Dashboard.Controller.js";



const router = Router()

router.route("/stats").get(verifyjwt,verifyAdmin, getDashboardStats)


export default router
