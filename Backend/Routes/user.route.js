import {Router} from "express"

import { authorizeRole, verifyJWT } from "../Middleware/auth.middleware.js"
import { adminLogin, registerAdmin, registerStudent,  studentLogin, userLogout } from "../Controller/user.controller.js";
import {SubmitFeedback} from "../Controller/feedback.controller.js"
import { markAttendance, viewAllAttendance, viewOwnAttendance } from "../Controller/attendence.controller.js";

const router = Router();

// router.route("/register").post(registeruser)
router.route("/adminRegister").post(registerAdmin)
router.route("/studentRegister").post(registerStudent)
router.route("/admin/login").post(adminLogin)
router.route("/student/login").post(studentLogin)
router.route("/logout").post(verifyJWT,userLogout)
router.route("/student/feedbacks").post(verifyJWT,SubmitFeedback)


// router.route("/markattendence").post(verifyJWT, authorizeRole, markAttendance)
router.route("/markattendence")
    .post(verifyJWT, authorizeRole("admin"), markAttendance);

router.route("/viewAllAttendence").get(verifyJWT, authorizeRole("admin"), viewAllAttendance)
// router.route("/viewownattendence").get(verifyJWT, authorizeRole("student"), viewOwnAttendance)

router.route("/viewownattendance")
    .get(verifyJWT, authorizeRole("student"), viewOwnAttendance);



export default router