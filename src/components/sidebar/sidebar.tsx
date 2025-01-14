"use client";
import React, { useContext } from "react";
import { IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions } from "react-icons/md";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const context = useContext(MyContext);

  if (!context) {
    return null;
  }

  const { googleSignIn } = UserAuth();
  const { isOpen, isSignedIn } = context;

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("Error during sign-in:", error);
    }
  };

  return (
    <div>
      {/* For larger screens, show full sidebar */}
      <div
        className={`fixed top-16 left-0 h-full bg-gray-50 text-black shadow-lg z-10 transition-all duration-300 ${
          isOpen ? "w-60" : "w-16"
        } hidden sm:block`}
      >
        <div
          className={`${
            isOpen
              ? "flex flex-col mt-4 overflow-y-auto max-h-[calc(100vh-4rem)]"
              : "flex flex-col mt-4"
          }`}
        >
          <Link href="/" passHref>
            <button className="flex items-center py-2 px-4 hover:bg-gray-300 transition">
              <IoHomeOutline className="text-lg mr-4" />
              <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
                Home
              </span>
            </button>
          </Link>
          <Link href="/shorts" passHref>
            <button className="flex items-center py-2 px-4 hover:bg-gray-300 transition">
              <SiYoutubeshorts className="text-lg mr-4" />
              <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
                Shorts
              </span>
            </button>
          </Link>
          <button className="flex items-center py-2 px-4 hover:bg-gray-300 transition">
            <MdSubscriptions className="text-lg mr-4" />
            <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
              Subscriptions
            </span>
          </button>
          <hr />
          {!isSignedIn && isOpen && (
            <div className="flex flex-col items-start py-2 px-4 text-black hover:bg-gray-300 transition space-y-2">
              <div className="text-sm">
                Sign in to like videos, comment, and subscribe.
              </div>
              <div
                className="flex items-center ml-6 space-x-2 border border-blue-500 text-gray-800 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition"
                onClick={handleSignIn}
              >
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white">
                  <IoPersonOutline className="w-3 h-3" />
                </div>
                <span className="text-gray-800 text-sm font-medium">Sign In</span>
              </div>
              <hr />
            </div>
          )}
        </div>
      </div>

      {/* For smaller screens (footer only) */}
      <div className="block sm:hidden fixed bottom-0 left-0 w-full bg-gray-50 text-black shadow-lg z-10">
        <div className="flex justify-around py-2">
          <Link href="/" passHref>
            <button className="flex flex-col items-center">
              <IoHomeOutline className="text-lg" />
              <span className="text-xs">Home</span>
            </button>
          </Link>
          <Link href="/shorts" passHref>
            <button className="flex flex-col items-center">
              <SiYoutubeshorts className="text-lg" />
              <span className="text-xs">Shorts</span>
            </button>
          </Link>
          <button className="flex flex-col items-center">
            <MdSubscriptions className="text-lg" />
            <span className="text-xs">Subscriptions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
