import { Router } from "express";
import { createProduct, deleteSingleProduct, getAllProduct, getSingleProduct, updateProduct } from "../Controllers/Product.Controller.js";


import { verifyjwt } from "../Middlewares/auth.middleware.js";




const router = Router()


router.route("/create").post(createProduct)
router.route("/getAllProducts").get(getAllProduct)
router.route("/:id").get(getSingleProduct)
router.route("/delete/:id").delete(deleteSingleProduct)
router.route("/update/:id").patch(updateProduct)



export default router