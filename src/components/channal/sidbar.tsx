"use client";
import React, { useContext, useState } from "react";
import { MyContext } from "@/context/vidoContext/VideoContext";
import Link from "next/link";
import Image from "next/image";

function Sidbar2() {
  const context = useContext(MyContext);
  const { channels, isOpen = false } = context || {};
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className={`fixed top-16 left-0 h-full bg-white-100 text-black shadow-lg z-20 transition-all duration-300 ${
          isOpen ? "w-60" : "w-16"
        }`}
      >
        <div className="flex flex-col mt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {loading ? (
            <div className="animate-pulse">
              <div
                className={`${
                  isOpen ? "w-20 h-20 ml-12" : "w-8 h-8"
                } bg-gray-300 rounded-full`}
              ></div>
              <div
                className={`${
                  isOpen ? "block" : "hidden"
                } mt-4 ml-10 w-24 h-4 bg-gray-300 rounded`}
              ></div>
              <div
                className={`${
                  isOpen ? "block" : "hidden"
                } mt-2 ml-10 w-32 h-4 bg-gray-300 rounded`}
              ></div>
            </div>
          ) : (
            <Link href={`/userAcount/videos?username=${channels?.name}`}>
              <button className="py-2 px-4">
              <Image
  src={channels?.profile || '/default-profile.png'} 
  alt="Profile"
  width={isOpen ? 80 : 32} 
  height={isOpen ? 80 : 32} 
  className={isOpen ? "rounded-full ml-12" : "rounded-full"} 
/>
                <p
                  className={`${
                    isOpen ? "block" : "hidden"
                  } ml-10 mt-2 text-gray-500`}
                >
                  Your Channel
                </p>
                <p
                  className={`${
                    isOpen ? "block" : "hidden"
                  } ml-10 text-sm text-gray-500`}
                >
                  {channels?.name}
                </p>
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidbar2;
