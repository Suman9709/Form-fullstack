import Attendence from '../Models/attendencemodel.js'
import { Student } from "../Models/studentmodel.js";
import { ApiError } from "../Utils/ApiError.js"; // Custom error handler
import { asyncHandler } from "../Utils/asyncHandle.js";
import mongoose from 'mongoose';

// Admin can mark attendance for a student
const markAttendance = asyncHandler(async (req, res) => {
    try {
        // Log to verify that the controller is triggered
        console.log('Mark Attendance Controller Triggered');

        // Check if the logged-in user is an admin
        if (req.user.role !== "admin" && req.user.role !== "institute") {
            throw new ApiError(403, "You are not authorized to mark attendance");
        }

        // Destructure the input fields from the request body
        const { student_id, batch, status } = req.body;

        // Ensure all required fields are provided
        if (!student_id || !batch || !status) {
            throw new ApiError(400, "Please provide all the required fields");
        }

        // Validate student_id format
        if (!mongoose.Types.ObjectId.isValid(student_id)) {
            throw new ApiError(400, "Invalid student_id format");
        }

        // Convert student_id to ObjectId if it's valid
        const studentObjectId = new mongoose.Types.ObjectId(student_id);

        // Find the student by ID
        const student = await Student.findById(studentObjectId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        // Check if attendance already exists for the student for today
        const today = new Date();
        const existingAttendance = await Attendence.findOne({
            user_id: studentObjectId,  // Match the `user_id` in the attendance
            "attendence_record.date": {
                $gte: new Date(today.setHours(0, 0, 0, 0)),  // Start of the day
                $lt: new Date(today.setHours(23, 59, 59, 999)),  // End of the day
            },
        });

        // If attendance is already marked for today, throw an error
        if (existingAttendance) {
            throw new ApiError(400, "Attendance for today is already marked");
        }

        // Create a new attendance record
        const newAttendance = new Attendence({
            user_id: studentObjectId,  // Use ObjectId for `user_id`
            attendence_record: [
                {
                    date: new Date(),
                    status: status,  // 'P' (Present) or 'A' (Absent)
                },
            ],
        });

        // Save the attendance record
        await newAttendance.save();
        console.log('Attendance marked successfully');

        // Respond with the success message and attendance details
        res.status(201).json({
            message: "Attendance marked successfully",
            attendance: newAttendance,
        });
    } catch (error) {
        // Log the error and send the error response
        console.error("Error occurred while marking attendance:", error);
        res.status(500).json({ message: "Server error during attendance marking" });
    }
});





// Admin can view all students' attendance, optionally filtered by batch
// Admin can view all students' attendance, optionally filtered by batch
const viewAllAttendance = asyncHandler(async (req, res) => {
    // Check if the logged-in user is an admin
    if (req.user.role !== "admin") {
        throw new ApiError(403, "You are not authorized to view all attendance records");
    }

    const { batch } = req.query;

    let attendanceRecords;
    if (batch) {
        attendanceRecords = await Attendence.find({ batch }).populate("user_id", "firstName lastName email batch"); // Changed to user_id
    } else {
        attendanceRecords = await Attendence.find().populate("user_id", "firstName lastName email batch"); // Changed to user_id
    }

    if (!attendanceRecords || attendanceRecords.length === 0) {
        throw new ApiError(404, "No attendance records found");
    }

    res.status(200).json({
        message: "Attendance records fetched successfully",
        attendance: attendanceRecords,
    });
});

// Student can view their own attendance
const viewOwnAttendance = asyncHandler(async (req, res) => {
    // Check if the logged-in user is a student
    if (req.user.role !== "student") {
        throw new ApiError(403, "You are not authorized to view attendance records");
    }

    // Fetch the attendance records of the logged-in student
    const studentAttendance = await Attendence.find({
        user_id: req.user._id, // Changed to user_id
    }).populate("user_id", "firstName lastName email batch"); // Changed to user_id

    if (!studentAttendance || studentAttendance.length === 0) {
        throw new ApiError(404, "No attendance records found for this student");
    }

    res.status(200).json({
        message: "Attendance fetched successfully",
        attendance: studentAttendance,
    });
});


export { markAttendance, viewAllAttendance, viewOwnAttendance };
