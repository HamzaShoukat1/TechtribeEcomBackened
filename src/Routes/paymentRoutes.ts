import { Router } from "express";
import { getPaymentDetails, handlePayment, webhook } from "../Controllers/Payment.Controller.js";
import { verifyjwt } from "../Middlewares/auth.middleware.js";

import express from "express"


const router = Router()


router.route("/checkout-session").post(express.json(), verifyjwt, handlePayment)

router.route("/webhooks").post(express.raw({ type: "application/json" }), webhook);
router.route("/getcurrentpurchasedetail/:session_id").get(verifyjwt,getPaymentDetails)

export default router