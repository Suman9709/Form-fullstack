import { Form } from "../Models/formModel.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandle.js";

const SubmitFeedback = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, contact, feedback } = req.body;

        if (!firstName || !lastName || !contact || !feedback) {
            throw new ApiError(400, "All fields are required");
        }

        // check for the required feedback

        const { overallExperience, satisfactionLevel } = feedback
        if (
            typeof overallExperience !== "number" ||
            typeof satisfactionLevel !== "number" ||
            overallExperience < 1 ||
            overallExperience > 5 ||
            satisfactionLevel < 1 ||
            satisfactionLevel > 5
        ) {
            throw new ApiError(400, "Feedback rating must be between 1 to 5");
        }

        // create feedback form 

        const form = new Form({
            userId: req.user._id,
            firstName,
            lastName,
            contact,
            feedback,
        });

        const savedForm = await form.save();
        return res
            .status(200)
            .json(
                new ApiResponse(200, {
                    message: "Feedback from filled successfully"
                })
            )
    } catch (error) {
        res.status(500).json({ error: "An error occurred while submitting feedback" });

    }
})

export default {
    SubmitFeedback,
}