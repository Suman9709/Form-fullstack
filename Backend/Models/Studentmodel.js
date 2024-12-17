import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        trype:String,
        required:true,
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
    email:{
        type:String,
        require:true,

    },
});

export const Student = mongoose.model("Student", studentSchema)