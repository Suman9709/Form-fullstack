import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt with username:", username); // Debug log

    try {
      const response = await fetch("http://localhost:5000/users/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Make sure it's lowercase 'application/json'
        },
        body: JSON.stringify({ username, email: username, password }),
        credentials: "include", // Ensure credentials are included
      });
      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (response.status === 200) {  // Changed from 201 to 200 for login
        // Store the token and user information in localStorage
        const { accessToken, student } = data.data;

        // Store the token and user information in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("firstName", student.firstName);
        localStorage.setItem("lastName", student.lastName);

        console.log("Logged in successfully, navigating to StudentHome");
        // Redirect to the Student Home page after successful login
        navigate("/StudentHome");  // Ensure this path is correct
      } else {
        console.error("No access token found in response data");
        setError(data.message);
      }
    } catch (error) {
      setError("Error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="bg-[#080710] h-screen flex flex-col justify-center items-center overflow-hidden">
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
          Password <span className="text-red-500">*</span>
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
            <Link to="/Studentsignup" className="text-blue-500 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
