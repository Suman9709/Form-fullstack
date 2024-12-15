import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    formTitle: { type: String, required: true },
    formData: { type: Object, required: true },
    submittedAt: { type: Date, default: Date.now }
});

export  const Form = mongoose.model("Form", formSchema) 