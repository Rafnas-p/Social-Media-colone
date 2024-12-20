"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { MdOutlineModeEdit } from "react-icons/md";

import Link from "next/link";

function ShortsBord() {
  const context = useContext(MyContext);
  const [showDescription, setShowDescription] = useState(false);
  const isOpen = context?.isOpen ?? false;

  if (!context) {
    console.error(
      "MyContext is not defined. Ensure the provider wraps this component."
    );
    return null;
  }
  const { shorts } = context;



  return (
    <div
    className={`flex flex-col p-6 transition-all duration-300  ${
      isOpen ? "ml-64" : "ml-16"} bg-white-100 min-h-screen`}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-gray-300 px-4 py-2">Shorts</th>
              <th className="border border-gray-300 px-4 py-2">Visibility</th>
              <th className="border border-gray-300 px-4 py-2">Restrictions</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Views</th>
              <th className="border border-gray-300 px-4 py-2">Comments</th>
              <th className="border border-gray-300 px-4 py-2">
                Likes (vs Dislikes)
              </th>
            </tr>
          </thead>
          <tbody>
            {shorts.map((short, index) => (
              <tr key={short._id} className="even:bg-gray-100 odd:bg-white">
                <td
                  className="flex border border-gray-300 px-4 py-2 relative"
                  onMouseEnter={() => setShowDescription(true)}
                  onMouseLeave={() => setShowDescription(false)}
                >
                  <div className="flex space-x-4">
                    <video className="w-40 h-24">
                      <source src={short.videoUrl} type="video/mp4" />
                    </video>

                    <div>
                      <p className="font-medium">{short.title || "No Title"}</p>

                      {showDescription ? (
                        <Link href={`/editshorts/${short._id}`}>
                          <MdOutlineModeEdit className="text-gray-500 cursor-pointer" />
                        </Link>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">
                          {short.description || "No Description"}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {short.visibility || "Public"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {short.restrictions || "None"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(short.createdAt || Date.now()).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {short.views || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {short.comments || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {short.likes || 0} (vs {short.dislikes || 0})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShortsBord;
