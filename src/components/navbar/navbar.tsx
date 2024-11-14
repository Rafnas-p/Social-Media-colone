"use client";
import React, { useContext } from "react";
import { BsBellFill } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import Searchbar from "./searchbar";
import { MyContext } from "../../context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext"; 

const Navbar: React.FC = () => {
  const context = useContext(MyContext);
  const { googleSignIn, logOut, user } = UserAuth(); 

  if (!context) {
    return null;
  }

  const { toggleSidebar } = context;

  
  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("Error during sign-in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log("Error during sign-out:", error);
    }
  };

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 shadow z-10">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-2">
          <FaBars className="text-gray-800" />
        </button>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png?20170829160812"
          alt="YouTube Logo"
          className="h-6 w-20 md:ml-8"
        />
      </div>
      <div className="flex items-center justify-center flex-grow">
        <Searchbar />
      </div>
      <div className="flex items-center">
        <BsBellFill className="text-gray-800 w-6 h-6 cursor-pointer hover:text-gray-600 transition" />
      </div>

      {/* Conditional rendering for Sign In and Sign Out */}
      <div className="relative">
        {user ? (
          <div
            className="flex items-center ml-6 space-x-2 bg-blue-100 text-gray-800 px-4 py-2 rounded-full cursor-pointer hover:bg-blue-200 transition"
            onClick={handleSignOut}
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white">
              <IoPersonOutline className="w-4 h-4" />
            </div>
            <span className="text-gray-800 font-medium">Sign Out</span>
          </div>
        ) : (
          <div
            className="flex items-center ml-6 space-x-2 bg-blue-100 text-gray-800 px-4 py-2 rounded-full cursor-pointer hover:bg-blue-200 transition"
            onClick={handleSignIn}
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white">
              <IoPersonOutline className="w-4 h-4" />
            </div>
            <span className="text-gray-800 font-medium">Sign In</span>
          </div>
        )}

        
        {user && (
          <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-md">
            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={handleSignOut}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
