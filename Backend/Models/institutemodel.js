import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const instituteSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        enum: ["Roorkee Academy", "Shivalik College", "Roorkee Institute of Technology", "Dehradun Academy", "Quantum University", "COER University"]
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'institute'],
        default: 'student',
        required: true,
    },

});

// Pre-save hook to hash password
instituteSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();

    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

instituteSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

instituteSchema.methods.generateAccessToken = function () {
    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES || "5h";

    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            username: this.username,
            role: this.role,
            // _id: institute._id,               // Institute's unique ID
            // name: institute.name,             // Institute's name
            // username: institute.username,     // Institute's username
            // role: institute.role,             // Institute's role
            // instituteName: institute.instituteName,  // Add the instituteName here
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
            expiresIn,
        }
    );
};

instituteSchema.methods.generateRefreshToken = function () {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES || "7d";
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn,
        }
    );
};

export const InstituteModel = mongoose.model("InstituteModel", instituteSchema);
