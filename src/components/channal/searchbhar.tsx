import React from 'react'
import { IoMdSearch } from "react-icons/io";

function Searchbhar2() {

  return (
    <div>
        <div className=" px-4 sm:px-0 fixed top-4 flex flex-col items-center z-10">
      <div className="relative w-full sm:w-[500px]">
        <input
          type="text"
          placeholder="Search..."

          className="p-3 rounded-full border border-gray-300 w-full h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        
        <div className="absolute top-0 right-0 h-full w-10 sm:w-12 bg-gray-200 p-2 rounded-r-full border border-gray-300 flex items-center justify-center">
          <span><IoMdSearch size={18} /></span>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Searchbhar2
