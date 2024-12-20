import { asyncHandler } from "../Utils/asyncHandle.js";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/userModel.js";
import { ApiResponse } from "../Utils/ApiResponse.js"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { Student } from "../Models/studentmodel.js";
import { InstituteModel } from "../Models/institutemodel.js";


const generateAccessandRefreshToken = async (userId) => {
    try {
        const admin = await User.findById(userId);
        if (!admin) {
            throw new ApiError(404, "Admin not found"); 
        }

        const accessToken = admin.generateAccessToken(); 
        const refreshToken = admin.generateRefreshToken(); 

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        console.error("Error in token generation:", error); 
        throw new ApiError(500, "Something went wrong while generating refresh token and access token");
    }
};


const generateAccessandRefreshTokenStudent = async (studentId) => {
    try {
        const objectId = new mongoose.Types.ObjectId(studentId); 
        const student = await Student.findById(objectId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        const accessToken = student.generateAccessToken(); 
        const refreshToken = student.generateRefreshToken(); 

        console.log("Generated access token:", accessToken);
        console.log("Generated refresh token:", refreshToken);

        student.refreshToken = refreshToken; 

        await student.save();

        console.log("Student saved with refresh token");

        return { refreshToken, accessToken }; 
    } catch (error) {
        console.error("Error in token generation:", error);
        throw new ApiError(500, "Something went wrong while generating refresh token and access token");
    }
};

// Register a Student
const registerStudent = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, username, password, student_id, batch, contact, instituteName } = req.body;

    if ([firstName, lastName, email, username, password, student_id, batch, contact, instituteName].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const institute = await InstituteModel.findOne({ name: instituteName });

    if (!institute) {
        throw new ApiError(400, "Invalid institute name provided");
    }

    const existingUser = await Student.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    // Create a new student and associate the student with the institute
    const student = await Student.create({
        firstName,
        lastName,
        username: username.toLowerCase(),
        email,
        password,
        role: 'student',
        student_id,
        batch,
        contact,
        instituteName: institute.name,
        institute: institute._id, 
    });

    
    const createdStudent = await Student.findById(student._id).select("-password -refreshToken");

   
    if (!createdStudent) {
        throw new ApiError(500, "Something went wrong while registering student");
    }

    
    return res.status(201).json({
        success: true,
        data: createdStudent,
        message: "Student registered successfully"
    });
});



const studentLogin = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    const student = await Student.findOne({
        $or: [{ username }, { email }]
    });

    if (!student) {
        throw new ApiError(404, "Student does not exist");
    }

    const isPasswordValid = await student.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshTokenStudent(student._id);
    const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                student: loggedInStudent, accessToken, refreshToken
            },
                "Student logged in successfully"
            )
        );
});


const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, username, password } = req.body;
    if ([name, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are require")
    }

    const existAdmin = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existAdmin) {
        throw new ApiError(409, "Admin already exist with this email or username")
    }
    const admin = await User.create({
        name,
        username: username.toLowerCase(),
        email,
        password,
        role: 'admin',

    })

    console.log("Admin created", admin);


    const createAdmin = await User.findById(admin._id).select(
        "-password -refreshToken"
    )

    console.log("Create admin Details", createAdmin);

    if (!createAdmin) {
        throw new ApiError(500, "something went wrong while registering Admin")
    }

    return res.status(201).json(
        new ApiError(200, createAdmin, "Admin register successfully")
    )

});




//Admin login

const adminLogin = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is require")
    }

    const admin = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!admin) {
        throw new ApiError(404, "Admin does not found")
    }


    const isPasswordValid = await admin.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Credential")
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(admin._id)
    const loggedInAdmin = await User.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                admin: loggedInAdmin, accessToken, refreshToken
            },
                "Admin loggedIn successfully"
            )
        )

});

const userLogout = asyncHandler(async (req, res) => {

try {
    // `req.user` is set by the verifyJWT middleware
    const user = req.user;  

    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }

    // Get role (either 'admin' or 'student')
    const role = user.role ? user.role : 'user';

    // Clear the refresh token for the user or student
    user.refreshToken = null;

    // Save the changes to the database
    if (user instanceof User) {
        await user.save(); // For admin (User model)
    } else if (user instanceof Student) {
        await user.save(); // For student (Student model)
    }
    else if (user instanceof InstituteModel) {
        await user.save(); // For student (Student model)
    }

    // Clear the access token cookie
    res.clearCookie('accessToken', { 
        httpOnly: true,    // Prevents JavaScript access to the cookie
        secure: true,  // Set to true in production for HTTPS
        sameSite: 'Strict',  // Prevents cross-site request forgery
        path: '/'  // Set the path to the root of the site
    });

    // Send a success response
    res.status(200).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged out successfully!` });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during logout" });
}
});

const refreshAccessTokenAdmin = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookie || req.refreshToken

    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorised request");
    }

    try {

        const decodeToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const admin = await User.findById(decodeToken?._id)

        if (!admin) {
            throw new ApiError(401, "Invalid refresh Token")
        }
        if (incommingRefreshToken !== admin?.refreshToken) {
            throw new ApiError(401, "refresh Token is used or expires")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } = await generateAccessandRefreshToken(admin._id)
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("rfreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, { accessToken, refreshToken: newRefreshToken },
                    "Access Token refresh"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


const refreshAccessTokenStudent = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookie || req.refreshToken

    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorised request");
    }

    try {

        const decodeToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const student = await Student.findById(decodeToken?._id)

        if (!student) {
            throw new ApiError(401, "Invalid refresh Token")
        }
        
        if (incommingRefreshToken !== student?.refreshToken) {
            throw new ApiError(401, "refresh Token is used or expires")
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } = await generateAccessandRefreshTokenStudent(student._id)
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("rfreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, { accessToken, refreshToken: newRefreshToken },
                    "Access Token refresh"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})




export {
    // registeruser,
    // loginUser
    registerAdmin,
    registerStudent,
    adminLogin,
    studentLogin,
    userLogout,
    refreshAccessTokenAdmin,
    refreshAccessTokenStudent,
}