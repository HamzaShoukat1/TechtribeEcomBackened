import { Router } from "express"
import { AddToCartItem } from "../Controllers/CartController.js"
import { verifyjwt } from "../Middlewares/auth.middleware.js"
const router = Router()



router.route("/create/:id").post(verifyjwt, AddToCartItem)



export default router