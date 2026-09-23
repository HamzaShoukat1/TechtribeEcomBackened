import { Router } from "express";

import {
    createProduct,
    deleteSingleProduct,
    getAllProduct,
    getAllProductForAdmin,
    getSingleProduct,
    searchProducts,
    updateProduct,
} from "../Controllers/Product.Controller.js";

import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { verifyAdmin } from "../Middlewares/admin.middleware.js";

const router = Router();

// Public routes
router.route("/getAllProducts").get(getAllProduct);

// Admin-only routes
router.route("/create").post(
    verifyjwt,
    verifyAdmin,
    createProduct
);

router.route("/getAllProductsForAdmin").get(
    verifyjwt,
    verifyAdmin,
    getAllProductForAdmin
);
router.route("/delete/:id").delete(
    verifyjwt,
    verifyAdmin,
    deleteSingleProduct
);

router.route("/update/:id").patch(
    verifyjwt,
    verifyAdmin,
    updateProduct
);

router.route("/search").get(searchProducts)
router.route("/:id").get(getSingleProduct);

export default router;