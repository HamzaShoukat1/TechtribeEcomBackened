import { Router } from "express";

import {
    createProduct,
    deleteSingleProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
} from "../Controllers/Product.Controller.js";

import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { verifyAdmin } from "../Middlewares/admin.middleware.js";

const router = Router();

// Public routes
router.route("/getAllProducts").get(getAllProduct);
router.route("/:id").get(getSingleProduct);

// Admin-only routes
router.route("/create").post(
    verifyjwt,
    verifyAdmin,
    createProduct
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

export default router;