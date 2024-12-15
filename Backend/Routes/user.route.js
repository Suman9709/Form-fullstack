import {Router} from "express"

import { verifyJWT } from "../Middleware/auth.middleware.js"
import { adminLogin, registerAdmin, registerStudent,  studentLogin, userLogout } from "../Controller/user.controller.js";

const router = Router();

// router.route("/register").post(registeruser)
router.route("/adminRegister").post(registerAdmin)
router.route("/studentRegister").post(registerStudent)
router.route("/admin/login").post(adminLogin)
router.route("/student/login").post(studentLogin)
router.route("/logout").post(verifyJWT,userLogout)

export default router