"use client";
import React from 'react';
import { BsBellFill } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import Searchbar from './searchbar';

interface NavbarProps {
  toggleSidebar: () => void; 
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="bg-transparent h-16 flex items-center justify-between px-4 md:px-8 shadow-none">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden">
          <FaBars className="text-gray-800" />
        </button>
        <img 
          src='https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png?20170829160812' 
          alt="YouTube Logo" 
          className="h-6 w-20 md:ml-8" 
        />
      </div>
      <div className="hidden md:flex space-x-6">
        <Searchbar />
      </div>
      <div className="flex items-center">
        <BsBellFill className="text-gray-800 w-6 h-6 cursor-pointer hover:text-gray-600 transition" />
      </div>
    </nav>
  );
};

export default Navbar;
