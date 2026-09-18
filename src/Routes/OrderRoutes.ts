import { Router } from "express";
import { changedOrderStatus, getOrderDetail, getOrdersForTable, getUserOrdersHistory } from "../Controllers/Order.Controller.js";
import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { verifyAdmin } from "../Middlewares/admin.middleware.js";

const router = Router()


router.route("").get(verifyjwt, getUserOrdersHistory)
router.route("/ForAdminOrdersTable").get(verifyjwt, verifyAdmin, getOrdersForTable)
router.route("/:id").get(verifyjwt, verifyAdmin, getOrderDetail)
router.route("/:id/status").put(verifyjwt, verifyAdmin, changedOrderStatus)


export default router



