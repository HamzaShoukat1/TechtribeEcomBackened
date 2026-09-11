import { Router } from "express";
import {   getUserOrdersHistory } from "../Controllers/Order.Controller.js";
import { verifyjwt } from "../Middlewares/auth.middleware.js";

const router = Router()


router.route("").get(verifyjwt,getUserOrdersHistory)


export default router



