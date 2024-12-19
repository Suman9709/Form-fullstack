import React, { useState } from 'react';
import InputBox from './InputBox';
import { Link } from 'react-router-dom';

const RegistrationForm = () => {
    const [firstName, setfirstName] = useState("");
    const [lastName, setlasName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [selectBatch, setSelectBatch] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const student = await fetch("http://localhost:5000/users/studentRegister", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({  firstName: firstName,
                    lastName: lastName,  // Ensure this is included
                    student_id: studentId,  // Ensure this is included
                    batch: selectBatch,  // This is where batch value is sent
                    contact,
                    email,
                    username,
                    password,
                 })
            });

            const data = await student.json();

            if (student.status === 201) {
                console.log("Registration Successful", data);

            }
            else {
                setError(data.message)
            }
        } catch (error) {
            setError("An error occured try again")
            console.error(error)
        }
    }

    // const handleBatch = (e) => {
    //     setSelectBatch(e.target.value);
    // }

    return (
        <div className="bg-[#080710] w-full h-full flex justify-center items-center p-12">
            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="bg-white/20 relative w-full max-w-[370px] h-full backdrop-blur-lg border-2 border-white/10 rounded-lg p-6 md:p-8 shadow-xl flex flex-col justify-center mt-4">
                <h3 className="text-3xl font-medium text-center text-white">Register Here</h3>

                <div className="flex flex-col">
                    {/* Input Fields */}
                    <InputBox
                        label="First Name"
                        type="text"
                        id="firstname"
                        value={firstName}
                        placeholder="First Name"
                        onChange={(e) => setfirstName(e.target.value)}
                        required
                    />

                    <InputBox
                        label="Last Name"
                        type="text"
                        id="laststname"
                        value={lastName}
                        placeholder="Last Name"
                        onChange={(e) => setlasName(e.target.value)}
                        required
                    />

                    <InputBox
                        label="Student Id"
                        type="text"
                        id="studentId"
                        value={studentId}
                        placeholder="Student Id"
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />

                    {/* Batch Selection */}
                    <label htmlFor="batch" className="block text-lg font-medium text-white mt-4">
                        Choose Batch <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="batch"
                        value={selectBatch}
                        onChange={(e) => setSelectBatch(e.target.value)}
                        className="w-full h-[50px] bg-white/10 rounded-sm p-3 mt-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="" className="bg-transparent text-black">Select a Batch</option>
                        <option value="Basic" className="bg-white/10 hover:bg-blue-200 text-black">Basic</option>
                        <option value="Intermediate" className="bg-white/10 hover:bg-blue-200 text-black">Intermediate</option>
                        <option value="Advanced" className="bg-white/10 hover:bg-blue-200 text-black">Advanced</option>
                        <option value="Other" className="bg-white/10 hover:bg-blue-200 text-black">Other</option>
                    </select>

                    <InputBox
                        label="Contact"
                        type="text"
                        placeholder="Contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />
                    <InputBox
                        label="Email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <InputBox
                        label="Username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <InputBox
                        label="Password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 p-4 bg-white text-[#080710] font-semibold text-lg rounded-md cursor-pointer"
                    >
                        Sign Up
                    </button>
                </div>


                <div className="mt-6 text-center text-white">
                    <p className="text-lg">
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-500 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default RegistrationForm;
