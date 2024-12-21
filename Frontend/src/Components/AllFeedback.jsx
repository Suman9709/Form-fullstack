import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('all');
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);

    const batchOptions = ["All", "Basic", "Intermediate", "Advance"];

    const fetchFeedbacks = async (batch = 'all') => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No token found');
            setError('No token found');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/users/viewallfeedbacks?batch=${batch}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setFeedbacks(response.data.data.feedbackForms);
            setFilteredFeedbacks(response.data.data.feedbackForms);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError('Failed to fetch feedbacks');
            console.error(err);
        }
    };

    // Fetch feedbacks initially
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Re-fetch feedbacks when batch filter changes
    useEffect(() => {
        fetchFeedbacks(selectedBatch);
    }, [selectedBatch]);

    return (
        <div>
            <div className="admin-feedback-list">
                <h2>All Student Feedback Forms</h2>

                {/* Filter Dropdown for Batch */}
                <div>
                    <label htmlFor="batchFilter">Filter by Batch: </label>
                    <select
                        id="batchFilter"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)} // Update selectedBatch state
                    >
                        {batchOptions.map((batch) => (
                            <option key={batch} value={batch}>
                                {batch}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Loading and Error Handling */}
                {loading && <p>Loading feedbacks...</p>}
                {error && <p>{error}</p>}

                {/* No feedbacks found */}
                {!loading && filteredFeedbacks.length === 0 && <p>No feedbacks found.</p>}

                {/* Displaying feedbacks */}
                {!loading && filteredFeedbacks.length > 0 && (
                    <table className='border-black border-2'>
                        <thead>
                            <tr className='border-black border-2'>
                                <th className='border-black border-2 p-2  text-center  '>First Name</th>
                                <th className='border-black border-2  p-2  text-center  '>Last Name</th>
                                <th className='border-black border-2 p-2  text-center '>Contact</th>
                                <th className='border-black border-2 p-2 text-center'>Batch</th>
                                <th className='border-black border-2 p-2  text-center '>Overall Experience</th>
                                <th className='border-black border-2 p-2  text-center'>Satisfaction Level</th>
                                <th className='border-black border-2 p-2  text-center'>Comments</th>
                                <th className='border-black border-2 p-2 text-center'>Suggestion</th>
                            </tr>
                        </thead>
                        <tbody className='border-2 border-black'>
                            {filteredFeedbacks.map((feedback) => (
                                <tr key={feedback._id} className='border-2 border-black'>
                                    <td className='border-black border-2 p-2'>{feedback.firstName}</td>
                                    <td className='border-black border-2 p-2'>{feedback.lastName}</td>
                                    <td className='border-black border-2 p-2'>{feedback.contact}</td>
                                    <td className='border-black border-2 p-2'>{feedback.batch}</td>
                                    <td className='border-black border-2 p-2 text-center'>{feedback.feedback.overallExperience}</td>
                                    <td className='border-black border-2 p-2 text-center'>{feedback.feedback.satisfactionLevel}</td>
                                    <td className='border-black border-2 p-2 text-center'>{feedback.feedback.comments || "No comments"}</td>
                                    <td className='border-black border-2 p-2 text-center'>{feedback.feedback.suggestions || "No suggestions"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AllFeedback;
