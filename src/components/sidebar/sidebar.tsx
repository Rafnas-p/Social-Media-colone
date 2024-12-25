"use client";

import React, { useContext } from "react";
import { IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions } from "react-icons/md";
import { GrFormNext } from "react-icons/gr";
import { categories } from "../utils/constants";
import Link from "next/link";
import { MyContext } from "@/context/vidoContext/VideoContext";

const Sidebar: React.FC = () => {
  const context = useContext(MyContext);

  if (!context) {
    return null;
  }

  const { isOpen } = context;

  return (
    <div
      className={`fixed top-16 left-0 h-full bg-white text-black shadow-lg z-20 transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      <div className="flex flex-col mt-4 max-h-[calc(100vh-4rem)]">
        <Link href="/" passHref>
          <button className="flex items-center py-2 px-4 hover:bg-gray-300 transition">
            <IoHomeOutline className="text-lg mr-4" />
            <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
              Home
            </span>
          </button>
        </Link>
         <Link href='/shorts' passHref>
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
        <button className="flex items-center py-2 px-3 hover:bg-gray-300 transition">
          <IoPersonOutline className="text-black-600 text-sm ml-1" />
          <GrFormNext
            className={`${isOpen ? "block" : "hidden"} text-gray-600 text-sm  `}
          />
          <span className={`${isOpen ? "block" : "hidden"} text-sm`}>You</span>
        </button>
        {isOpen &&
          categories.map((item, index) => (
            <Link href={item.href || "#"} key={index}>
              <button className="flex items-center py-2 px-4 hover:bg-gray-300 transition w-full text-left">
                <span className="text-lg mr-4">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
