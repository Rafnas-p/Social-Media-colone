"use client";
import React, { useContext, useState, useEffect } from "react";
import { BsBellFill } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import Searchbar from "./searchbar";
import { MyContext } from "../../context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
const Navbar: React.FC = () => {
  const context = useContext(MyContext);
  const { googleSignIn, logOut, user } = UserAuth();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
  }, [isDropdownOpen]);

  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      setIsSignedIn(!!user);
      setLoading(false);
    }, 2000);
  }, [user]);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { toggleSidebar, channels } = context;

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

  const handulhomerout = () => {
    router.push("/");
  };
  return (
    <nav className="bg-white fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 shadow z-30">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-2 hidden sm:block"
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
          width={68}
          height={68}
          onClick={handulhomerout}
        />
      </Link>

      <div className="flex items-center justify-center flex-grow">
        <Searchbar />
      </div>

      <div
        className={`text-gray-800 w-5 h-5 cursor-pointer hover:text-gray-600 transition ${
          isSignedIn ? "mr-3 mt-1" : "mr-2"
        }`}
        aria-label="Notifications"
      >
        <BsBellFill />
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
            <Image
              src={
                channels
                  ? channels.profile
                  : user?.photoURL ||
                    "https://www.w3schools.com/w3images/avatar2.png"
              }
              alt="Profile"
              width={32}
              height={32}
              className=" rounded-full"
            />
          </button>
        ) : (
          <div
            className="flex items-center ml-6 space-x-2 border border-blue-500 text-gray-800 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition"
            onClick={handleSignIn}
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white">
              <IoPersonOutline className="w-4 h-4" />
            </div>
            <span className="text-gray-800 font-medium">Sign In</span>
          </div>
        )}

        {isDropdownOpen && isSignedIn && (
          <div className="absolute top-2 mr-8 right-2 w-52 bg-white shadow-lg rounded-md z-20">
            <div className="flex items-center px-4 py-2 text-gray-800">
              <Image
                src={
                  channels
                    ? channels.profile
                    : user?.photoURL ||
                      "https://www.w3schools.com/w3images/avatar2.png"
                }
                alt="Profile"
                className=" rounded-full mt-1"
                width={32}
                height={32}
              />
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  {channels ? channels.name : user?.displayName}
                </p>
              </div>
            </div>
            {channels ? (
              <Link
                className="ml-3 text-sm text-blue-600"
                href={`/userAcount/videos?username=${
                  channels ? channels.name : user?.displayName
                }`}
              >
                view channal
              </Link>
            ) : (
              <Link
                className="ml-3 text-sm text-blue-600"
                href={`/creatchannel`}
              >
                creat channel
              </Link>
            )}

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
