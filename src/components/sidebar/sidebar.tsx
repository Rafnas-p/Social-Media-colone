import React from 'react';
import { FaBars } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-transparent text-black transition-transform duration-300 shadow-none
        ${isOpen ? 'w-54' : 'w-16'} overflow-hidden shadow-lg`} // Adjust width here as needed
    >
      <button 
        className="flex items-center justify-between w-full h-16 p-4" // Set fixed height here
        onClick={toggleSidebar}
      >
        <FaBars className="text-black text-2xl" /> {/* Increase icon size for visibility */}
        {isOpen && (
          ''
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col mt-4">
          <a href="#" className="py-2 px-4 hover:bg-gray-300 transition">
            Home
          </a>
          <a href="#" className="py-2 px-4 hover:bg-gray-300 transition">
            About
          </a>
          <a href="#" className="py-2 px-4 hover:bg-gray-300 transition">
            Services
          </a>
          <a href="#" className="py-2 px-4 hover:bg-gray-300 transition">
            Contact
          </a>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

