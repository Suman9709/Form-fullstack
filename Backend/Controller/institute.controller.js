import { InstituteModel } from "../Models/institutemodel.js";
import { Student } from "../Models/studentmodel.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandle.js";


const generateAccessandRefreshToken = async (userId) => {
    try {

        const institute = await InstituteModel.findById(userId);

        if (!institute) {
            throw new ApiError(404, "Institute not found");
        }

        const accessToken = institute.generateAccessToken();
        const refreshToken = institute.generateRefreshToken();

        institute.refreshToken = refreshToken;
        await institute.save({ validateBeforeSave: false });
        return { refreshToken, accessToken }

    } catch (error) {
        console.log("Error in token generation", error);
        throw new ApiError(500, "Something went wrong while generating accessToken and refrehs Token")

    }
};


const registerInstitute = asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;

    if ([name, username, password].some((filed) => filed?.trim() === "")) {
        throw new ApiError(400, "All fields are require")
    }

    const existInstitute = await InstituteModel.findOne({username})

    if (existInstitute) {
        throw new ApiError(409, "institute already exist with this username")
    }

    const institute = await InstituteModel.create({
        name,
        username: username.toLowerCase(),
        password,
        role: 'institute',
    })

    console.log("Institute created", institute);

    const createInstitute = await InstituteModel.findById(institute._id).select(
        "-password -refreshToken"
    )

    console.log("create Institute details", createInstitute);

    if (!createInstitute) {
        throw new ApiError(500, "Something went wrong while registering Institute")
    }

    return res.status(201).json(
        new ApiError(200, createInstitute, "Institute register successfully")
    )
});


const InstituteLogin = asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;

    if (!(name || username)) {
        throw new ApiError(400, "Username is required to login")
    };

    // Fix: pass the username inside an object as the filter parameter
    const institute = await InstituteModel.findOne({ username });

    if (!institute) {
        throw new ApiError(404, "Institute does not found");
    }

    const isPasswordValid = await institute.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(institute._id);
    const loggedInInstitute = await InstituteModel.findById(institute._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                institute: loggedInInstitute, accessToken, refreshToken
            },
                "Institute LoggedIn Successfully"
            )
        );
});



const getInstituteStudents = asyncHandler(async (req, res) => {
    try {
        // Check if the logged-in user is an institute
        if (req.user.role !== "institute") {
            throw new ApiError(403, "You are not authorized to view students");
        }

        // Fetch all students associated with the institute
        const students = await Student.find({ instituteId: req.user._id }).select("-password -refreshToken");

        if (!students || students.length === 0) {
            throw new ApiError(404, "No students found for this institute");
        }

        res.status(200).json({
            message: "Students fetched successfully",
            students,
        });
    } catch (error) {
        console.error("Error occurred while fetching students:", error);
        res.status(500).json({ message: "Server error while fetching students" });
    }
});


const refreshAccessTokenInstitute = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies?.refreshToken || req.refreshToken;

    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorised request");
    }

    try {
        // Decode the refresh token
        const decodeToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find the institute using the decoded ID
        const institute = await InstituteModel.findById(decodeToken?._id);

        if (!institute) {
            throw new ApiError(401, "Invalid refresh Token");
        }

        // Check if the refresh token matches the one stored in the institute record
        if (incommingRefreshToken !== institute?.refreshToken) {
            throw new ApiError(401, "refresh Token is used or expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        // Generate new tokens
        const { accessToken, newRefreshToken } = await generateAccessandRefreshToken(institute._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, { accessToken, refreshToken: newRefreshToken },
                    "Access Token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});


export {
    registerInstitute,
    InstituteLogin,
    refreshAccessTokenInstitute,
    getInstituteStudents,
}
