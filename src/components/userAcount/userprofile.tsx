"use client";

import React, { useContext } from "react";
import { UserAuth } from "@/context/authcontext/authcontext";
import { MyContext } from "@/context/vidoContext/VideoContext";
import UserVideos from "./userVideos"; // Import corrected component
import Link from "next/link";
import UserShorts from "./userShoerts";
const Userprofile: React.FC = () => {
  const context = useContext(MyContext);
  const { isOpen } = context;

  const { user } = UserAuth();

  return (
    <>
      <div
        className={`flex flex-row mt-28 space-y-4 ${
          isOpen ? "ml-60 mt-24" : "ml-32 mt-24"
        }`}
      >
        <img
          src={user?.photoURL || "https://via.placeholder.com/600/61a65"}
          alt="Profile"
          className="w-28 h-28 rounded-full"
        />
        <div>
          <p className="text-lg font-medium ml-3">{user?.displayName}</p>
          <p className="text-sm font-medium ml-3 text-gray-500">{user?.email}</p>
          <span>
            <button className="px-4 text-gray-500">Customize Channel</button>
            <Link href="/channal" className="text-gray-500">
              Manage Videos
            </Link>
          </span>
        </div>
      </div>
      <div  className="ml-24 mt-6">
      <span>
        <Link href={'/userAcount/videos'}>Videos</Link> 
        <Link href={'/userAcount/shorts' } className="ml-3">shorts</Link>
      </span>
      </div>
      <hr className="border-gray" />
      <div className="mt-6 px-6">
      </div>
      
    </>
  );
};

export default Userprofile; 