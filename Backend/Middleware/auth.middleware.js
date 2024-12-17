// import { ApiError } from "../Utils/ApiError.js";
// import { User } from "../Models/userModel.js";
// import jwt from "jsonwebtoken"
// import { asyncHandler } from "../Utils/asyncHandle.js";


// export const verifyJWT = asyncHandler(async (req,res,next)=>{
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//         if(!token){
//             throw new ApiError(401, "unauthorized request")
//         };

//         const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

//         const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

//         if(!user){
//             throw new ApiError(401, "Invalid accessToken")

//         }

//         req.user = user;
//         next();

//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid accessToken")
//     }
// }) 


// import { ApiError } from "../Utils/ApiError.js";
// import { User } from "../Models/userModel.js";
// import { Student } from "../Models/Studentmodel.js";
// import jwt from "jsonwebtoken";
// import { asyncHandler } from "../Utils/asyncHandle.js";

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//     try {
//         // Extract token from cookies or Authorization header
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//             throw new ApiError(401, "Unauthorized request");
//         }

//         // Verify the token
//         const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

//         // Find the user by ID and exclude sensitive fields
//         const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

//         if (!user) {
//             throw new ApiError(401, "Invalid accessToken");
//         }

//         // Attach user to the request object for later use
//         req.user = user;
//         next();
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid accessToken");
//     }
// });

// // Middleware to check user role
// export const authorizeRole = (...allowedRoles) => {
//     return (req, res, next) => {
//         // Check if user is logged in and their role is allowed
//         if (!req.user || !allowedRoles.includes(req.user.role)) {
//             throw new ApiError(403, "Access denied. Insufficient permissions.");
//         }
//         next();
//     };
// };



// verifyJWT.js

import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/userModel.js";
import { Student } from "../Models/Studentmodel.js";
import { asyncHandler } from "../Utils/asyncHandle.js";

// Middleware to verify JWT and find the user or student
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify the token
        const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

        // Try to find the user by ID in User or Student model
        let user = await User.findById(decodeToken?._id).select("-password -refreshToken");
        let student = await Student.findById(decodeToken?._id).select("-password -refreshToken");

        // If neither user nor student is found, throw error
        if (!user && !student) {
            throw new ApiError(401, "Invalid accessToken");
        }

        // Attach the found user/student to the request object for later use
        req.user = user || student;

        next();
    } catch (error) {
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