import { asyncHandler } from "../Utils/asyncHandle.js";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/userModel.js";
import { ApiResponse } from "../Utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const generateAccessandRefreshToken = async (userId) => {
    try {
        const admin = await User.findById(userId);
        if (!admin) {
            throw new ApiError(404, "Admin not found"); // ✅ Added null check for `admin`.
        }

        const accessToken = admin.generateAccessToken(); // ✅ Now safe because `admin` is guaranteed to exist.
        const refreshToken = admin.generateRefreshToken(); // ✅ Safe after null check.

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        console.error("Error in token generation:", error); // ✅ Added logging for debugging.
        throw new ApiError(500, "Something went wrong while generating refresh token and access token");
    }
};


const generateAccessandRefreshTokenStudent = async (userId) => {
    try {
        const student = await User.findById(userId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        const accessToken = student.generateAccessToken(); // Generate access token
        const refreshToken = student.generateRefreshToken(); // Generate refresh token

        console.log("Generated access token:", accessToken);
        console.log("Generated refresh token:", refreshToken);

        student.refreshToken = refreshToken; // Assign refresh token to student
        
        await student.save(); // Save student with the refresh token
        
        console.log("Student saved with refresh token");

        return { refreshToken, accessToken }; // Return tokens
    } catch (error) {
        console.error("Error in token generation:", error); 
        throw new ApiError(500, "Something went wrong while generating refresh token and access token");
    }
};

// Register a Student
const registerStudent = asyncHandler(async (req, res) => {
    const { name, email, username, password } = req.body;

    if ([name, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    const student = await User.create({
        name,
        username: username.toLowerCase(),
        email,
        password,
        role: 'student',
    });

    // Changes made here: using lean() method to get plain JavaScript object instead of Mongoose document
    const createdStudent = await User.findById(student._id).select("-password -refreshToken"); // fixed issue with exclusion

    if (!createdStudent) {
        throw new ApiError(500, "Something went wrong while registering student");
    }

    return res.status(201).json(
        new ApiError(200, createdStudent, "Student registered successfully")
    );
});

// Student Login
const studentLogin = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    const student = await User.findOne({
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
    const loggedInStudent = await User.findById(student._id).select("-password -refreshToken");

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
if([name,email,username,password].some((field)=>field?.trim()==="")
){
    throw new ApiError(400, "All fields are require")
}

const existAdmin = await User.findOne({
    $or:[{email}, {username}]
})

if(existAdmin){
    throw new ApiError(409, "Admin already exist with this email or username")
}
   const admin = await User.create({
    name,
    username:username.toLowerCase(),
    email,
    password,
    role: 'admin',

   })

   console.log("Amin created", admin);


   const createAdmin = await User.findById(admin._id).select(
    "-password -refreshToken"
   )

   console.log("Create admin Details", createAdmin);

   if(!createAdmin){
    throw new ApiError(500, "something went wrong while registering Admin")
   }
   
   return res.status(201).json(
    new ApiError(200, createAdmin, "Admin register successfully")
   )
   
});




//Admin login

const adminLogin = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if(!(username || email)){
        throw new ApiError(400, "Username or email is require")
    }

    const admin = await User.findOne({
        $or:[{username}, {email}]
    })

    if(!admin){
        throw new ApiError(404, "Admin does not found")
    }


    const isPasswordValid = await admin.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Credential")
    }

const {accessToken, refreshToken}=await generateAccessandRefreshToken(admin._id)
const loggedInAdmin = await User.findById(admin._id).select("-password -refreshToken")

const options = {
    httpOnly:true,
    secure:true,
}

return res.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
    new ApiResponse(
        200,{
            admin:loggedInAdmin,accessToken,refreshToken
        },
        "Admin loggedIn successfully"
    )
)

});

const userLogout = asyncHandler(async (req, res) => {
    const { email, username } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email }, { username }]

        })

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        // Clear the refresh token for the user
        user.refreshToken = null;
        await user.save();
        res.status(200).json({ message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} logged out successfully!` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during logout" });
    }
})



export {
    // registeruser,
    // loginUser
    registerAdmin,
    registerStudent,
    adminLogin,
    studentLogin,
    userLogout
}