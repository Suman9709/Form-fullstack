import { Router } from "express"

import { authorizeRole, verifyJWT } from "../Middleware/auth.middleware.js"
import { adminLogin, registerAdmin, registerStudent, studentLogin, userLogout } from "../Controller/user.controller.js";
import { GetAllFeedback, SubmitFeedback } from "../Controller/feedback.controller.js"
import { markAttendance, viewAllAttendance, viewOwnAttendance } from "../Controller/attendence.controller.js";
import { getInstituteStudents, InstituteLogin, registerInstitute } from "../Controller/institute.controller.js";

const router = Router();

// router.route("/register").post(registeruser)
router.route("/adminRegister").post(registerAdmin)
router.route("/instituteRegister").post(registerInstitute)
router.route("/admin/login").post(adminLogin)
router.route("/studentRegister")
    .post(registerStudent);  

// Route for student login
router.route("/student/login")
    .post(studentLogin);  // Login for any student
router.route("/institute/login").post(InstituteLogin)
router.route("/logout").post(verifyJWT, userLogout)
router.route("/student/feedbacks").post( SubmitFeedback)

router.get(
    "/institutestudents",
    verifyJWT,authorizeRole("admin", "institute"), // Only institutes can fetch their students
    getInstituteStudents
);
// router.route("/markattendence").post(verifyJWT, authorizeRole, markAttendance)
router.route("/markattendence")
    .post(verifyJWT, authorizeRole("admin", "institute"), markAttendance);

router.route("/viewAllAttendence").get(verifyJWT, authorizeRole("admin"), viewAllAttendance)
// router.route("/viewownattendence").get(verifyJWT, authorizeRole("student"), viewOwnAttendance)

router.route("/viewownattendance")
    .get(verifyJWT, authorizeRole("student"), viewOwnAttendance);
router.route("/viewallfeedbacks")
    .get(verifyJWT, authorizeRole("admin"), GetAllFeedback);




export default router