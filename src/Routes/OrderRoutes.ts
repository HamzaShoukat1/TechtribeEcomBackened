import { Router } from "express";
import { changedOrderStatus, getAllOrdersForAdmin, getOrdersForTable, getUserOrdersHistory } from "../Controllers/Order.Controller.js";
import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { verifyAdmin } from "../Middlewares/admin.middleware.js";

const router = Router()


router.route("").get(verifyjwt, getUserOrdersHistory)
router.route("/ForAdminOrders").get(verifyjwt, verifyAdmin, getAllOrdersForAdmin)
router.route("/ForAdminOrdersTable").get(verifyjwt, verifyAdmin, getOrdersForTable)
router.route("/:id/status").put(verifyjwt,verifyAdmin,changedOrderStatus)


export default router



