
// verifyJWT.js

import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/userModel.js";
// import { Student } from "../Models/Studentmodel.js";
import { Student } from "../Models/studentmodel.js";
import { asyncHandler } from "../Utils/asyncHandle.js";

// Middleware to verify JWT and find the user or student
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log('Token received:', token);

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the JWT and decode the token
        const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decodeToken);

        // Retrieve user or student based on the decoded token's _id
        let user = await User.findById(decodeToken?._id).select("-password -refreshToken");
        let student = await Student.findById(decodeToken?._id).select("-password -refreshToken");

        // If neither user nor student is found, throw an error
        if (!user && !student) {
            throw new ApiError(401, "Invalid accessToken");
        }

        // Attach the found user or student to req.user
        req.user = user || student;

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);  // Log the error for debugging
        throw new ApiError(401, error?.message || "Invalid accessToken");
    }
});

 // Middleware to check user role

export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied. Insufficient permissions.");
        }
        next();
    };
};
