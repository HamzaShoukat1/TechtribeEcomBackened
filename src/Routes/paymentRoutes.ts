import { Router } from "express";
import { handlePayment, webhook } from "../Controllers/Payment.Controller.js";
import { verifyjwt } from "../Middlewares/auth.middleware.js";

import express from "express"


const router = Router()


router.route("/checkout-session").post(verifyjwt, handlePayment)

router.route("/webhooks").post(express.raw({ type: "application/json" }), webhook);


export default router