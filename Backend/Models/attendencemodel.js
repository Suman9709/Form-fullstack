import mongoose from "mongoose"


const attendenceSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    attendence_record:[
        {
            date:{
                type:Date,
                requuired:true,
            },
            status:{
                type:String,
                enum:["P", "A"],
                required:true,
            },
        },
    ],
});

const Attendence = mongoose.model("Attendence", attendenceSchema)

export default Attendence;