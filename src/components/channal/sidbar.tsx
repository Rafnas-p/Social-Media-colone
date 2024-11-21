import React, { useContext } from 'react'
import { MyContext } from '@/context/vidoContext/VideoContext'
import { IoHomeOutline, } from "react-icons/io5";

import Link from 'next/link';
function Sidbar2() {
    const context = useContext(MyContext);

    if (!context) {
      return null;
    }
  
    const { isOpen } = context;
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
        <button className="flex items-center py-2 px-4 hover:bg-gray-300 transition">
         
          <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
            Shorts
          </span>
        </button>
        <button className="flex items-center py-2 px-4 hover:bg-gray-300 transition">
        
          <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
            Subscriptions
          </span>
        </button>
        </div>
        </div>
   </>
  )
}

export default Sidbar2