import React, { useState } from 'react';
import InputBox from './InputBox';
import { Link } from 'react-router-dom';

const AdminRegistrationForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
           const response = await fetch("http://localhost:5000/users/adminRegister", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({name, email, username, password})
           }) ;
           const data = await response.json()

           if(response.status === 201){
            console.log("Admin registration successful", data);
            
           }
           else{
            setError(data.message)
           }
        } catch (error) {
          setError("An error occur Please try again")  
          console.error(error)
        }
    }

    return (
        <div className="bg-[#080710] w-full h-full flex justify-center items-center p-12">

           
            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="bg-white/20 relative w-full max-w-[370px] h-full backdrop-blur-lg border-2 border-white/10 rounded-lg p-6 md:p-8 shadow-xl flex flex-col justify-center mt-4">
                <h3 className="text-3xl font-medium text-center text-white">Register Here</h3>

                <div className="flex flex-col">
                    {/* Input Fields */}
                    <InputBox
                        label= "Name"
                        type="text"
                        id="name"
                        value={name}
                        placeholder="First Name"
                        onChange={(e) => setName(e.target.value)}
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
                        <Link to="/AdminLogin" className="text-blue-500 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default AdminRegistrationForm
