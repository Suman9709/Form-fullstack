import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
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
    student_id:{
        type:String,
        require:true,
    },
    batch:{
        type:String,
        eum:["Basic", "Intermediate", "Advance","Other"]
    },
    contact:{
        type:Number,
        required:true,
    },
    refreshToken: {
        type: String
    },
    role:{
        type:String,
        enum:['admin', 'student'],
        required:true,
    }

});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();

    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
// 
};

userSchema.methods.generateAccessToken = function(){

const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES || "5h" 
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            email:this.email,
            username:this.username,
            role:this.role,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
           expiresIn
        }
    );
};


userSchema.methods.generateRefreshToken = function(){
    const expiresIn=process.env.REFRESH_TOKEN_EXPIRES || '7d'
    return jwt.sign(
        {
            id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn,
        }
    )
};

// userSchema.statics.verifyAccessToken = function (token) { // Added: Verify access token method
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
//         return decoded;
//     } catch (error) {
//         throw new Error("Invalid token");
//     }
// };



export const User = mongoose.model("User", userSchema);