// Models/attendencemodel.js
import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },

    attendence_record: [
        {
            date: {
                type: Date,
                required: true,
            },
            status: {
                type: String,
                enum: ["P", "A"],
                required: true,
            },
        },
    ],
});


const Attendence = mongoose.model("Attendence", attendenceSchema);

// Export Attendence model
export default Attendence;
