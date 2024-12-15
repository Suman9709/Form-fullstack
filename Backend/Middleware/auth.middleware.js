import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/userModel.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../Utils/asyncHandle.js";


export const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            throw new ApiError(401, "unauthorized request")
        };

        const decodeToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401, "Invalid accessToken")

        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid accessToken")
    }
}) 