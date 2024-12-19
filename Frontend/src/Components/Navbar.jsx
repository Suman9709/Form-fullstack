import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // State to toggle the visibility of the profile dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Retrieve the user's name from localStorage (or another state management solution)
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  // Get the first letter of the first name and the last letter of the last name
  const profileName = firstName && lastName ? `${firstName[0]}${lastName[lastName.length - 1]}` : "U";

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/logout", {
        method: "POST",
        credentials: "include",  // To send cookies with the request
      });

      const data = await response.json();

      if (response.status === 200) {
        // Clear access token and user details from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");

        // Redirect to the login page
        navigate("/");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className='w-full h-[100px] bg-[#080710] flex items-center justify-between'>
      <div className='flex justify-center items-center gap-2'>
        <div className='flex justify-center items-center w-[60px] h-[60px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] text-white'>
          E
        </div>
        <div className='flex text-white'>
          <p>Institute Name</p>
        </div>
      </div>

      <div className='flex justify-center items-center gap-4'>
        <ul className='flex gap-2 text-white'>
          <li className='cursor-pointer'>Home</li>
          <li className='cursor-pointer'>Attendance</li>
        </ul>

        {/* Profile Section with dropdown */}
        <div className='relative'>
          <div 
            className='flex justify-center items-center w-[60px] h-[60px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] text-white cursor-pointer' 
            onClick={toggleDropdown}
          >
            {profileName}
          </div>

          {/* Dropdown Menu for Logout */}
          {isDropdownOpen && (
            <div className='absolute top-full right-0 bg-[#080710] text-white rounded-md mt-2 p-2 w-32 shadow-lg'>
              <button
                className='w-full text-left p-2 rounded-md hover:bg-white/20'
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
