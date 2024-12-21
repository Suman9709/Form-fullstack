import { Form } from "../Models/formModel.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { asyncHandler } from "../Utils/asyncHandle.js";

const SubmitFeedback = asyncHandler(async (req, res) => {
    try {
        // Destructure the required fields from request body
        const { firstName, lastName, contact,batch, feedback } = req.body;

        // Check if any required field is missing
        if (!firstName || !lastName || !contact || !feedback || !batch) {
            throw new ApiError(400, "All fields are required");
        }

        // Check if feedback ratings are valid (between 1 and 5)
        const { overallExperience, satisfactionLevel } = feedback;
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

       
        if (!req.user || !req.user._id) {
            throw new ApiError(401, "User must be authenticated");
        }

        // Create a new feedback form
        const form = new Form({
            userId: req.user._id,  // Ensure req.user._id exists
            firstName,
            lastName,
            contact,
            batch,
            feedback,
        });

       
        const savedForm = await form.save();

       
        return res.status(201).json(
            new ApiResponse(201, {
                message: "Feedback form submitted successfully",
            })
        );
    } catch (error) {
        console.error("Error occurred during feedback submission:", error); // Debug log
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ error: error.message });
        } else {
          
            return res.status(500).json({ error: "An error occurred while submitting feedback" });
        }
    }
});



const GetAllFeedback = asyncHandler(async (req, res) => {
    try {
        const { batch } = req.query; // Get batch filter from query params

        // Construct query to find feedbacks based on batch
        let query = {};

        // Apply batch filter if provided and is not 'all'
        if (batch && batch !== "all") {
            // Ensure batch is capitalized and matches the correct values
            query.batch = batch.charAt(0).toUpperCase() + batch.slice(1).toLowerCase(); // E.g., 'basic' => 'Basic'
        }

        // Fetch feedbacks from the database based on the constructed query
        const feedbackForms = await Form.find(query).populate('userId', 'firstName lastName email'); // Populate user info

        // Check if feedback forms were found
        if (!feedbackForms || feedbackForms.length === 0) {
            return res.status(404).json(new ApiResponse(404, { message: "No feedback forms found." }));
        }

        // Return the feedback forms
        return res.status(200).json(new ApiResponse(200, { feedbackForms }));

    } catch (error) {
        console.error("Error fetching feedback forms:", error); // Logging for debugging

        // Handle different types of errors more gracefully
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "An error occurred while fetching feedback forms." });
        }
    }
});

export {
    SubmitFeedback,
    GetAllFeedback,
}