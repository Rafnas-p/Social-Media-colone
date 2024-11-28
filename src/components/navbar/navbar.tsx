"use client"
import React, { useContext, useState, useEffect } from "react";
import { BsBellFill } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import Searchbar from "./searchbar";
import { MyContext } from "../../context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Navbar: React.FC = () => {
  const context = useContext(MyContext);
  const { googleSignIn, logOut, user } = UserAuth();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); 
const router=useRouter()
  useEffect(() => {
    setTimeout(() => {
      setIsSignedIn(!!user); 
      setLoading(false); 
    }, 2000); 
  }, [user]);

  const { toggleSidebar } = context;

  const handleSignIn = async () => {
    try {
      await googleSignIn();
      setIsSignedIn(true);
    } catch (error) {
      console.log("Error during sign-in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsSignedIn(false);
    } catch (error) {
      console.log("Error during sign-out:", error);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownOpen])
const handulhomerout=()=>{
  router.push('/')
}
  return (
    <nav className="bg-white fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 shadow z-30">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-2" aria-label="Toggle Sidebar">
          <FaBars className="text-gray-800" />
        </button>
        </div>
       
        <Link href="/" passHref>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png?20170829160812"
          alt="YouTube Logo"
          className="h-6 w-20 md:ml-8 cursor-pointer"
          onClick={handulhomerout}
        />
        </Link>
     

      <div className="flex items-center justify-center flex-grow">
        <Searchbar />
      </div>

      <div className="flex items-center mr-12">
        <BsBellFill
          className="text-gray-800 w-6 h-6 cursor-pointer hover:text-gray-600 transition"
          aria-label="Notifications"
        />
      </div>

      <div className="relative">
        {loading ? (
         
          <div className="animate-pulse flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        ) : isSignedIn ? (
          <button
            className="cursor-pointer"
            onClick={toggleDropdown}
            aria-label="Profile"
          >
            <img
              src={user?.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          </button>
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

        {isDropdownOpen && isSignedIn && (
          <div className="absolute top-2 mr-9 right-0 w-56 bg-white shadow-lg rounded-md z-20">
            <div className="flex items-center px-4 py-2 text-gray-800">
              <img
                src={user?.photoURL || "https://via.placeholder.com/600/61a65"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-sm text-gray-600">{user?.displayName}</p>
              </div>
            </div>
            <Link href="/userAcount" className="block px-4 py-2 hover:text-blue-800 ">
              Create a Channel
            </Link>
            <hr className="my-2 border-gray-300" />
            <button
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              onClick={handleSignOut}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
