"use client";

import React, { useContext } from "react";
import { UserAuth } from "@/context/authcontext/authcontext";
import { MyContext } from "@/context/vidoContext/VideoContext";

const Userprofile: React.FC = () => {
  const context = useContext(MyContext);
  const { isOpen } = context; // Retrieve the isOpen state from context

  const { user } = UserAuth();
  console.log(user);

  return (
    <>
      <div
        className={`flex flex-row mt-5 space-y-4 ${isOpen ? "ml-60 mt-24" : "ml-32 mt-24"}`}
      >
        <img
          src={user?.photoURL || "https://via.placeholder.com/600/61a65"}
          alt="Profile"
          className="w-28 h-28 rounded-full"
        />
        <div>
          <p className="text-lg font-medium ml-3">{user?.displayName}</p>
          <p className="text-sm font-medium ml-3 text-gray-500">{user?.email}</p>
          <span >
          <button className="px-4  text-gray-500">Customize Channel</button>
          <button className=" text-gray-500"  >Manage Videos</button>
        </span>
        </div>
      
        </div>
        <hr className="border-gray" />
    </>
  );
};

export default Userprofile;
