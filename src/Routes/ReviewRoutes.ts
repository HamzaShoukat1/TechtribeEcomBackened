import { Router } from "express";
import { CreateReviews, GetProductReviews } from "../Controllers/Review.Controller.js";


import { verifyjwt } from "../Middlewares/auth.middleware.js";



const router = Router()

router.route("/create").post(verifyjwt, CreateReviews)
router.route('/:productId').get(verifyjwt, GetProductReviews)


export default router
