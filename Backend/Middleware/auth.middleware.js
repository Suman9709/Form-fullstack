

import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/userModel.js";  // Assuming this is for general users
import { Student } from "../Models/studentmodel.js";  // Assuming this is for students
import { InstituteModel } from "../Models/institutemodel.js";  // Assuming this is for institutes
import { asyncHandler } from "../Utils/asyncHandle.js";

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//         console.log('Token received:', token);

//         if (!token) {
//             throw new ApiError(401, "Unauthorized request");
//         }

//         const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
//         console.log("Decoded Token:", decodeToken);

//         // Look for the user in either the User, Student, or Institute collection
//         let user = await User.findById(decodeToken?._id).select("-password -refreshToken");
//         let student = await Student.findById(decodeToken?._id).select("-password -refreshToken");
//         let institute = await InstituteModel.findById(decodeToken?._id).select("-password -refreshToken");

//         // If no user is found in any collection, throw error
//         if (!user && !student && !institute) {
//             throw new ApiError(401, "Invalid accessToken");
//         }

//         // Assign the correct user object to req.user
//         req.user = user || student || institute;

//         next();  
//     } catch (error) {
//         console.log(error);  
//         throw new ApiError(401, error?.message || "Invalid accessToken");
//     }
// });

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log('Token received:', token);  // Debugging line, check token in the request

        // If token is not provided, throw error
        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token provided");
        }

        // Decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decodedToken);  // Debugging line, check decoded token

        // Find user, student, or institute based on the decoded token
        let user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        let student = await Student.findById(decodedToken?._id).select("-password -refreshToken");
        let institute = await InstituteModel.findById(decodedToken?._id).select("-password -refreshToken");

        // If no matching user, student, or institute, throw error
        if (!user && !student && !institute) {
            throw new ApiError(401, "Unauthorized request - User not found");
        }

        // Assign the correct user object to req.user
        req.user = user || student || institute;

        // Proceed to the next middleware or route handler
        next();  
    } catch (error) {
        console.error("JWT Verification Error:", error);  // Log the error for debugging
        throw new ApiError(401, error?.message || "Unauthorized request - Invalid or expired token");
    }
});


export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied. Insufficient permissions.");
        }
        next();
    };
};
