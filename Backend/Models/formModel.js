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
  batch: {
    type: String,
    enum: ["Basic", "Intermediate", "Advance", "Other"],
    required: true,
  },
  feedback: {
    overallExperience: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    satisfactionLevel: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comments: {
      type: String,
      maxlength: 500,
    },
    suggestions: {
      type: String,
      maxlength: 500,
    },
  },
  submittedAt: { type: Date, default: Date.now },
});


export const Form = mongoose.model("Form", formSchema) 