import React from "react";
import { FaBars } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import { categories } from "../utils/constants";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white text-black transition-transform duration-300 shadow-lg shadow-none
        ${isOpen ? "w-54 overflow-y-auto" : "w-16 overflow-hidden"}`} 
    >
      
      <button
        className="flex items-center justify-between w-full h-16 p-4"
        onClick={toggleSidebar}
      >
        <FaBars className="text-black text-2xl" />
        {isOpen && (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png?20170829160812"
            alt="YouTube Logo"
            className="h-6 w-20 mr-3" 
          />
        )}
      </button>

      <div className="flex flex-col mt-4">
      <a
    href="#"
    className="flex items-center py-2 px-4 hover:bg-gray-300 transition"
  >
    <IoHomeOutline className="text-lg mr-4" /> 
    {isOpen && <span>Home</span>}
  </a>
  <a
    href="#"
    className="flex items-center py-2 px-4 hover:bg-gray-300 transition"
  >
    <SiYoutubeshorts className="text-lg mr-4" />
    {isOpen && <span>Shorts</span>}
  </a>
  <a
    href="#"
    className="flex items-center py-2 px-4 hover:bg-gray-300 transition"
  >
    <MdSubscriptions className="text-lg mr-4" /> 
    {isOpen && <span>Subscriptions</span>}
  </a>
        <hr />

        <a
          href="#"
          className="flex items-center py-2 px-3 hover:bg-gray-300 transition"
        >
          <div
            className={`mr-2 ${
              !isOpen ? "rounded-full p-0.5 bg-white border border-black" : ""
            }`}
          >
            {!isOpen ? (
              <IoPersonOutline className="text-black-600 text-sm" />
            ) : (
              <span className="text-black-300 text-sm">You</span>
            )}
          </div>
          {isOpen && <GrFormNext className="text-gray-600 text-sm" />}
        </a>

        {/* Mapping over categories - only show when isOpen */}
        {isOpen &&
          categories?.map((item, index) => (
            <button
              key={index}
              className="flex items-center py-2 px-4 hover:bg-gray-300 transition w-full text-left"
            >
              <span className="text-lg mr-4">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
