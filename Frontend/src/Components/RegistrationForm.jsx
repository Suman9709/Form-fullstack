import React, { useState } from 'react';
import InputBox from './InputBox';
import { Link } from 'react-router-dom';

const RegistrationForm = () => {
    const [firstName, setfirstName] = useState("");
    const [laststName, setlastName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [selectBatch, setSelectBatch] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [[password], setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("firstname", firstName);
    }

    const handleBatch = (e) => {
        setSelectBatch(e.target.value);
    }

    return (
        <div className="bg-[#080710] w-full h-full flex justify-center items-center p-12">

            {/* <div className="absolute w-1/2 top-16 buttom-0 flex justify-center items-center">

                <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-to-r from-[#1845ad] to-[#23a2f6] left-[-80px] md:left-[-100px] top-[-80px] md:top-[-120px] sm:left-[-60px] sm:top-[-60px]" />
                <div className="absolute w-[150px] h-[150px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819]  right-[-80px] md:right-[-100px] bottom-[-80px] md:bottom-[-120px] sm:right-[-60px] sm:bottom-[-60px]" />
            </div> */}
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
                    />

                    <InputBox
                        label="Last Name"
                        type="text"
                        id="laststname"
                        value={laststName}
                        placeholder="Last Name"
                        onChange={(e) => setlastName(e.target.value)}
                    />

                    <InputBox
                        label="Student Id"
                        type="text"
                        id="studentId"
                        value={studentId}
                        placeholder="Student Id"
                        onChange={(e) => setStudentId(e.target.value)}
                    />

                    {/* Batch Selection */}
                    <label htmlFor="batch" className="block text-lg font-medium text-white mt-4">
                        Choose Batch <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="batch"
                        value={selectBatch}
                        onChange={handleBatch}
                        className="w-full h-[50px] bg-white/10 rounded-sm p-3 mt-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="" className="bg-transparent text-black">Select a Batch</option>
                        <option value="basic" className="bg-white/10 hover:bg-blue-200 text-black">Basic</option>
                        <option value="intermediate" className="bg-white/10 hover:bg-blue-200 text-black">Intermediate</option>
                        <option value="advanced" className="bg-white/10 hover:bg-blue-200 text-black">Advanced</option>
                        <option value="other" className="bg-white/10 hover:bg-blue-200 text-black">Other</option>
                    </select>

                    <InputBox
                        label="Contact"
                        type="text"
                        placeholder="Contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />
                    <InputBox
                        label="Email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputBox
                        label="Username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <InputBox
                        label="Password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

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
