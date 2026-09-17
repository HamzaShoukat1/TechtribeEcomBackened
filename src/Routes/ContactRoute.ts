import { Router } from "express";
import { createContact } from "../Controllers/Contact.Controller.js";








const router = Router()
router.route("/create").post(createContact)



export default router