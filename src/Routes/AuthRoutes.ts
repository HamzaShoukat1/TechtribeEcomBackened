import { Router } from "express";
import { getAllUsers, getCurrentUser, Logout, SignUp } from "../Controllers/Auth.Controller.js";
import { Signin } from "../Controllers/Auth.Controller.js";
import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { verifyAdmin } from "../Middlewares/admin.middleware.js";

const router = Router()

router.route("/signup").post(SignUp)

router.route("/login").post(Signin)

router.route("/currentUser").get(verifyjwt, getCurrentUser)
router.get(
    "/all-users",
    verifyjwt,
    verifyAdmin,
    getAllUsers
);
router.route("/logout").post(verifyjwt, Logout)




export default router