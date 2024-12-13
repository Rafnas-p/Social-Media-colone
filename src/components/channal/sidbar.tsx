"use client"
import React, { useContext ,useState} from 'react'
import { MyContext } from '@/context/vidoContext/VideoContext'
import { IoHomeOutline, } from "react-icons/io5";
import { LuUserCircle } from "react-icons/lu";

import Link from 'next/link';
function Sidbar2() {
    const context = useContext(MyContext);

    const isOpen = context?.isOpen ?? false;
    

  return (
   <>
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
         <Link href={'/userAcount'}>
        <button className="flex items-center py-2 px-4 hover:bg-gray-300 transition">
        <LuUserCircle  className="text-lg mr-4"/>
          <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
            User
          </span>
        </button>
        </Link>

        </div>
        </div>
   </>
  )
}

export default Sidbar2