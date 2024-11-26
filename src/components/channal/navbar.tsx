"use client"
import React, { useContext, useState } from 'react'
import { FaBars } from "react-icons/fa";
import { MyContext } from '@/context/vidoContext/VideoContext';
import { RiVideoAddFill } from "react-icons/ri";

import { UserAuth } from '@/context/authcontext/authcontext';
import Link from 'next/link';
import Searchbhar2 from './searchbhar';


function Navbar2() {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const context = useContext(MyContext)
    const { toggleSidebar } = context
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

    return (
        <div>
            <nav className="bg-white fixed inset-0 flex items-center justify-center h-16 px-4 shadow z-30">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="mr-2" aria-label="Toggle Sidebar">
                        <FaBars className="text-gray-800" />
                    </button>
                </div>

                <Link href="/" passHref>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png?20170829160812"
                        alt="YouTube Logo"
                        className="h-6 w-20 cursor-pointer"
                    />
                </Link>

                <div className="flex items-center justify-between flex-grow ml-44">
                    <Searchbhar2 />
                </div>

                <div className="flex items-center">
                    <RiVideoAddFill
                        className="text-gray-800 w-6 h-6 mr-8 cursor-pointer hover:text-gray-600 transition"
                        aria-label="Notifications"
                    />
                </div>

                <div className="relative">
                    <button
                        className="cursor-pointer"
                        onClick={toggleDropdown}
                        aria-label="Profile"
                    >
                        <img
                            src={user?.photoURL || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                        />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-2 mr-9 right-0 w-56 bg-white shadow-lg rounded-md z-20">
                            <div className="flex items-center px-4 py-2 text-gray-800">
                                <img
                                    src={user?.photoURL || "https://via.placeholder.com/600/61a65"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{user?.email}</p>
                                    <p className="text-sm text-gray-600">{user?.displayName}</p>
                                </div>
                            </div>
                            <Link href="/userAcount" className="block px-4 py-2 text-blue-600 hover:text-blue-800 hover:underline">
                                Create a Channel
                            </Link>
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
    )
}

export default Navbar2;
