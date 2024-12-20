import React, { useEffect, useState } from 'react';
import InputBox from './InputBox';

const FeedbackForm = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [overallExperience, setOverallExperience] = useState("");
    const [satisfactionLevel, setSatisfactionLevel] = useState("");
    const [comments, setComments] = useState("");
    const [suggestions, setSuggestion] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    useEffect(() => {
        if (successMessage) {
            setTimeout(() => {
                setSuccessMessage(""); 
            }, 3000);  
        }

        if (error) {
            setTimeout(() => {
                setError("");  
            }, 3000);  
        }
    }, [successMessage, error]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("accessToken");  
        const firstName = localStorage.getItem("firstName"); 
       // console.log("Token retrieved from localStorage:", token);  
        //console.log("First Name retrieved from localStorage:", firstName); 
    
        if (!token) {
            setError("You must be logged in to submit feedback.");
            return;
        }

        if (!firstname || !lastname || !contact || !overallExperience || !overallExperience) {
            setError("All fields are required.");
            return;
        }
        const feedbackData = {
            firstName: firstname,
            lastName: lastname,
            contact: contact,
            feedback: {
                overallExperience: Number(overallExperience),
                satisfactionLevel: Number(satisfactionLevel),
                comments: comments,
                suggestions: suggestions,
            },
           
        };
        console.log("Feedback data being sent to server:", feedbackData);
        try {
            const response = await fetch("http://localhost:5000/users/student/feedbacks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(feedbackData),
            });
            const data = await response.json();
            console.log("Response from server:", data); 
            if (response.status === 201) {
                setSuccessMessage("Feedback form submitted successfully!");
                setError(""); 
               
            } else {
                setError(data.message);
                setSuccessMessage("");  
            }

        } catch (error) {
            setError("An error occurred while submitting the feedback.");
            setSuccessMessage("");  
        }
    };

    return (
        <div>
            <div className='w-full bg-slate-900'>
                <h1 className='w-full text-white text-center pt-8'>Feedback form</h1>

                <form onSubmit={handleFormSubmit} className='w-full border-white border-2 p-4'>
                    <InputBox
                        type="text"
                        id="firstname"
                        label="First Name"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <InputBox
                        type="text"
                        id="lastname"
                        label="Last Name"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <InputBox
                        type="text"
                        id="contact"
                        label="Contact"
                        placeholder="Contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />

                    <div className='flex flex-col gap-2 pt-4'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-white'>Question No 1</p>
                            <select
                                className=' bg-white/10 p-2 text-white'
                                id="question1"
                                value={overallExperience}
                                onChange={(e) => setOverallExperience(e.target.value)}
                            >
                                <option className='bg-slate-700' value="Rate">Rate</option>
                                <option className='bg-slate-700' value="1">1</option>
                                <option className='bg-slate-700' value="2">2</option>
                                <option className='bg-slate-700' value="3">3</option>
                                <option className='bg-slate-700' value="4">4</option>
                                <option className='bg-slate-700' value="5">5</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <p className='text-white'>Question No 2</p>
                            <select
                                className='text-white bg-white/10 p-2'
                                id="question2"
                                value={satisfactionLevel}
                                onChange={(e) => setSatisfactionLevel(e.target.value)}
                            >
                                <option className='bg-slate-700' value="Rate">Rate</option>
                                <option className='bg-slate-700' value="1">1</option>
                                <option className='bg-slate-700' value="2">2</option>
                                <option className='bg-slate-700' value="3">3</option>
                                <option className='bg-slate-700' value="4">4</option>
                                <option className='bg-slate-700' value="5">5</option>
                            </select>
                        </div>

                        <div className='flex flex-col text-white gap-2'>
                            <p>Comments</p>
                            <textarea
                                name="textarea"
                                id="comments"
                                placeholder='Write comments here...'
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className=' bg-white/10 p-2'
                            />
                        </div>
                        <div className='flex flex-col text-white gap-2'>
                            <p>Suggestion</p>
                            <textarea
                                name="textarea"
                                id="suggestion"
                                placeholder='Write comments here...'
                                value={suggestions}
                                onChange={(e) => setSuggestion(e.target.value)}
                                className=' bg-white/10 p-2'
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-12 p-4 bg-white text-[#080710] font-semibold text-lg rounded-md cursor-pointer"
                    >
                        Submit
                    </button>

                    {/* Display success or error messages */}
                    {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
