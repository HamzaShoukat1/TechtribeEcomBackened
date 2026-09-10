import { Router } from "express"
import { AddToCartItem, getCartDetails, removeFromCart } from "../Controllers/CartController.js"
import { verifyjwt } from "../Middlewares/auth.middleware.js"
const router = Router()



router.route("/create/:id").post(verifyjwt, AddToCartItem)
router.route("/details").get(verifyjwt, getCartDetails)
router.route("/remove/:id").delete(verifyjwt, removeFromCart)



export default router