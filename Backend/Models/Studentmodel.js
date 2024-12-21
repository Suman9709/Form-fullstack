// Models/studentmodel.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Check if the model is already defined
const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    student_id: {  // This field should be an ObjectId
        type: String,
        required: true,
        // ref: 'Student',
    },
    batch: {
        type: String,
        enum: ["Basic", "Intermediate", "Advance", "Other"],
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'institute'],  // Add roles like 'admin' or 'student'
        default: 'student',          // Default role should be 'student'
        required: true,
    },
    institute: {  // New field to reference the institute
        type: mongoose.Schema.Types.ObjectId,
        ref: "InstituteModel",
        required: true,
    },
    instituteName: {  
        type: String,
        required: true, 
    }, 
});


// Pre-save hook to hash password
studentSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();

    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

// Method to check password
studentSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate access token
studentSchema.methods.generateAccessToken = function () {
    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES || "5h";
    return jwt.sign(
        {
            _id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            username: this.username,
            student_id: this.student_id,
            batch: this.batch,
            role: this.role,
            instituteName:this.instituteName,
            institute: this.institute,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
            expiresIn,
        }
    );
};

// Method to generate refresh token
studentSchema.methods.generateRefreshToken = function () {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES || "7d";
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn,
        }
    );
};

// Check if the model already exists to prevent overwriting
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export { Student };
