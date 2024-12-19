import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AdminLogin = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const[error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try {
      const response = await fetch("http://localhost:5000/users/admin/login", {
        method:"POST",
        headers:{
          "Content-Type":"Application/json"
        },
        body: JSON.stringify({username, email:username, password}),
        credentials:"include",
      });

      const data = await response.json()

      navigate("/AdminHome")

      if(response.status === 201){
        console.log("Admin LoggedIn Successfully", data);
        
      }
      else{
        setError(data.message)
      }
    } catch (error) {
      setError("Error occured Please try again")
      console.error(error)
    }
  };


  return (
    <div className="bg-[#080710] h-screen flex justify-center items-center overflow-hidden">
      <div className="absolute w-[350px] h-[450px]">
        <div className="absolute w-[180px] h-[180px] rounded-full bg-gradient-to-r from-[#1845ad] to-[#23a2f6] left-[-80px] top-[-80px]" />
        <div className="absolute w-[180px] h-[180px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] right-[-80px] bottom-[-80px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/20 w-[370px] h-[480px] backdrop-blur-lg border-2 border-white/10 rounded-lg p-12 shadow-xl flex flex-col justify-between"
      >
        <h3 className="text-3xl font-medium text-center text-white">Login Here</h3>

        <label htmlFor="username" className="block text-lg font-medium text-white mt-8">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="username"
          placeholder="Email or Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full h-[50px] bg-white/10 rounded-sm p-3 mt-2 text-white text-sm"
          required
        />

        <label htmlFor="password" className="block text-lg font-medium text-white mt-6">
          Password  <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-[50px] bg-white/10 rounded-sm p-3 mt-2 text-white text-sm"
          required
        />
 {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

        <button
          type="submit"
          className="w-full mt-12 p-4 bg-white text-[#080710] font-semibold text-lg rounded-md cursor-pointer"
        >
          Log In
        </button>

        <div className="mt-6 text-center text-white">
          <p className="text-lg">
            Don't have an account?{" "}
            <Link to="/AdminSignup" className="text-blue-500 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin

