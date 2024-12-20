import React, {useEffect, useState}from 'react'
import Navbar from './Navbar'
import FeedbackForm from './FeedbackForm'
import { useNavigate } from 'react-router-dom';

const StudentHome = () => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login"); // Redirect to login if no token is found
        } else {
            setIsLoggedIn(true); // Token found, user is logged in
        }
    }, [navigate]);

    return (
        // <div className='w-full h-screen bg-[#080710] flex flex-col'>
        //     <Navbar showBatchSelect={false}/>
        //     <FeedbackForm/>
        // </div>

        <div className='w-full h-screen bg-[#080710] flex flex-col'>
            {isLoggedIn ? (
                <div >
                    <Navbar showBatchSelect={false} />
                    <FeedbackForm />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default StudentHome