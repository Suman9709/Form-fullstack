import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // formTitle: { type: String, required: true },
    // formData: { type: Object, required: true },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    feedback: {
        overallExperience: {
          type: Number, // Rating between 1 to 5
          min: 1,
          max: 5,
          required: true,
        },
        satisfactionLevel: {
          type: Number, // Rating between 1 to 5
          min: 1,
          max: 5,
          required: true,
        },
        comments: {
          type: String, // Open-ended feedback
          maxlength: 500, // Optional limit to comment length
        },
        suggestions: {
          type: String, // Suggestions for improvement
          maxlength: 500,
        },
      },
      submittedAt: { type: Date, default: Date.now },
    });
    

export const Form = mongoose.model("Form", formSchema) 