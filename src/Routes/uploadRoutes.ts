import { Router } from "express";


import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { verifyAdmin } from "../Middlewares/admin.middleware.js";
import { upload } from "../Middlewares/upload.middleware.js";
import { uploadImage } from "../Controllers/upload.controller.js";



const router = Router()

router.route("/image").post(verifyjwt, verifyAdmin, upload.single("file"), uploadImage)

export default router
