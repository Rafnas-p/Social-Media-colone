"use client";
import React, { useContext, useState } from "react";
import { FaBars } from "react-icons/fa";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { RiVideoAddFill } from "react-icons/ri";

import { UserAuth } from "@/context/authcontext/authcontext";
import Link from "next/link";
import Searchbhar2 from "./searchbhar";
import Image from "next/image";

function Navbar2() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true); // Manage image loading state

  const context = useContext(MyContext);
   if (!context) {
    return <div>Loading...</div>;
  }
  const { toggleSidebar, channels } = context;

  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log("Error during sign-out:", error);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false); // Hide skeleton when image loads
  };

  return (
    <div>
      <nav className="bg-white fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 shadow z-30">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-2"
            aria-label="Toggle Sidebar"
          >
            <FaBars className="text-gray-800" />
          </button>
        </div>

        <Link href="/" passHref>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png?20170829160812"
            alt="YouTube Logo"
            className=" cursor-pointer"
            width={80}
            height={24}
          />
        </Link>

        <div className="flex items-center justify-center flex-grow">
          <Searchbhar2 />
        </div>

        <div className="flex items-center">
          <Link href={"/channal/upload"}>
            <span className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full mr-7 cursor-pointer transition">
              <RiVideoAddFill className="w-5 h-5" aria-label="Create Video" />
              <span className="text-black text-xs font-medium">Create</span>
            </span>
          </Link>
        </div>

        <div className="relative">
          <button
            className="cursor-pointer"
            onClick={toggleDropdown}
            aria-label="Profile"
          >
            {isImageLoading && (
              <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            )}
           <Image
    src={channels?.profile || user?.photoURL || '/default-profile.png'} 
    alt="Profile"
    width={32} 
    height={32} 
    className="rounded-full"
    onLoadingComplete={handleImageLoad} 
  />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-2 mr-9 right-0 w-56 bg-white shadow-lg rounded-md z-20">
              <div className="flex items-center px-4 py-2 text-gray-800">
                <Image
                  src={ channels?.profile || user?.photoURL || "https://www.w3schools.com/w3images/avatar2.png"}
                  alt="Profile"
                  className=" rounded-full"
                  width={40}
                  height={40}
                />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">{user?.displayName}</p>
                </div>
              </div>

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
    </div>
  );
}

export default Navbar2;
