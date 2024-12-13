"use client"
import Link from 'next/link';
import React, { useContext } from 'react';
import { MyContext } from '@/context/vidoContext/VideoContext';
function Channalnav() {
  
  const context=useContext(MyContext)
  const isOpen = context?.isOpen ?? false;

  return (
    <div
    className={`flex flex-col p-6 transition-all duration-300 mt-20 ${
      isOpen ? "ml-64" : "ml-16"  }`}>
        <h1 className="text-lg font-bold p-8">Channel Content</h1>

        <div className="flex space-x-8  ">
          <Link href={'/channal'}>
         Videos
          </Link>
          <Link href={'/channal/shortsbord'}>
            Shorts
          </Link>
          
        </div>
      <hr className="border-gray-300" />
    </div>
  );
}

export default Channalnav;
