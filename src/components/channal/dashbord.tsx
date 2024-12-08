"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { MdOutlineModeEdit } from "react-icons/md";

import Link from "next/link";

function Dashbord() {
  const context = useContext(MyContext);
  const [showDescription, setShowDescription] = useState(false);

  if (!context) {
    console.error(
      "MyContext is not defined. Ensure the provider wraps this component."
    );
    return null;
  }
  const { userVideos } = context;

  console.log("Fetched Data:", userVideos);

  console.log("userVideos", userVideos);

  return (
    <div className="mt-20 ml-20">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-gray-300 px-4 py-2">Video</th>
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
            {userVideos.map((video, index) => (
              <tr key={video._id} className="even:bg-gray-100 odd:bg-white">
                <td
                  className="flex border border-gray-300 px-4 py-2 relative"
                  onMouseEnter={() => setShowDescription(true)}
                  onMouseLeave={() => setShowDescription(false)}
                >
                  <div className="flex space-x-4">
                    {/* Video */}
                    <video className="w-40 h-24">
                      <source src={video.videoUrl} type="video/mp4" />
                    </video>

                    {/* Title and Description or Icon */}
                    <div>
                      <p className="font-medium">{video.title || "No Title"}</p>

                      {/* Conditionally show description or edit icon */}
                      {showDescription ? (
                        <Link href={`/edit/${video._id}`}>
                          <MdOutlineModeEdit className="text-gray-500 cursor-pointer" />
                        </Link>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">
                          {video.description || "No Description"}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Visibility Column */}
                <td className="border border-gray-300 px-4 py-2">
                  {video.visibility || "Public"}
                </td>
                {/* Restrictions Column */}
                <td className="border border-gray-300 px-4 py-2">
                  {video.restrictions || "None"}
                </td>
                {/* Date Column */}
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(video.createdAt || Date.now()).toLocaleDateString()}
                </td>
                {/* Views Column */}
                <td className="border border-gray-300 px-4 py-2">
                  {video.views || 0}
                </td>
                {/* Comments Column */}
                <td className="border border-gray-300 px-4 py-2">
                  {video.comments || 0}
                </td>
                {/* Likes vs Dislikes Column */}
                <td className="border border-gray-300 px-4 py-2">
                  {video.likes || 0} (vs {video.dislikes || 0})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashbord;
