"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import axios from "axios";
import { UserAuth } from "@/context/authcontext/authcontext";
import axiosInstance from "@/app/fairbase/axiosInstance/axiosInstance";

interface Video {
  _id: string;
  videoUrl: string;
  title: string;
  description: string;
  visibility: string;
  restrictions: string;
  createdAt: string;
  views: number;
  comments: number;
  likes: number;
  dislikes: number;
}

function ShortsBord() {
  const context = useContext(MyContext);
  const [shorts, setShorts] = useState<Video[]>([]); // State to store the shorts
  const [hoveredRow, setHoveredRow] = useState<string | null>(null); // Track the hovered row
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); // Track the dropdown state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const isOpen = context?.isOpen ?? false;
  const { user } = UserAuth() as { user: { _id: string; uid: string } | null };

  if (!context) {
    console.error(
      "MyContext is not defined. Ensure the provider wraps this component."
    );
    return null;
  }

  useEffect(() => {
    const fetchShorts = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/shorts", {
          params: { userId: user._id },
        });
        setShorts(response.data.shorts);
      } catch (err) {
        console.error("Error fetching shorts:", err);
        setError("Failed to fetch shorts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, [user?._id]);

  const handleDelete = async (videoId: string) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:5000/api/deleteShortsById/${videoId}`
      );
      console.log("Delete response:", response);

      // Update state to remove the deleted video
      setShorts((prevShorts) => prevShorts.filter((short) => short._id !== videoId));
    } catch (error) {
      console.error("Error in deleting video:", error);
    }
  };

  return (
    <div
      className={`flex flex-col p-6 transition-all duration-300 ${
        isOpen ? "ml-64" : "ml-16"
      } bg-white-100 min-h-screen`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="border px-4 py-2">Video</th>
              {/* Hide other columns on small screens */}
              <th className="border px-4 py-2 hidden sm:table-cell">Visibility</th>
              <th className="border px-4 py-2 hidden md:table-cell">Restrictions</th>
              <th className="border px-4 py-2 hidden lg:table-cell">Date</th>
              <th className="border px-4 py-2 hidden lg:table-cell">Views</th>
              <th className="border px-4 py-2 hidden lg:table-cell">Comments</th>
              <th className="border px-4 py-2 hidden xl:table-cell">Likes vs Dislikes</th>
            </tr>
          </thead>
          <tbody>
            {shorts.map((short) => (
              <tr
                key={short._id}
                className="even:bg-gray-100 odd:bg-white relative"
                onMouseEnter={() => setHoveredRow(short._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="flex border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-start space-x-4">
                    <video className="w-40 h-24">
                      <source src={short.videoUrl} type="video/mp4" />
                    </video>
                    <div>
                      <p className="font-medium">{short.title || "No Title"}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {short.description || "No Description"}
                      </p>
                    </div>
                  </div>
                  {hoveredRow === short._id && (
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() =>
                          setDropdownOpen((prev) =>
                            prev === short._id ? null : short._id
                          )
                        }
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <BsThreeDotsVertical />
                      </button>
                      {dropdownOpen === short._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md z-10">
                          <button
                            onClick={() => handleDelete(short._id)}
                            className="block w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                          <Link
                            href={`/editshorts/${short._id}`}
                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </td>
                {/* Other columns will only be visible on certain screen sizes */}
                <td className="border border-gray-300 px-4 py-2 hidden sm:table-cell">
                  {short.visibility || "Public"}
                </td>
                <td className="border border-gray-300 px-4 py-2 hidden md:table-cell">
                  {short.restrictions || "None"}
                </td>
                <td className="border border-gray-300 px-4 py-2 hidden lg:table-cell">
                  {new Date(short.createdAt || Date.now()).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 hidden lg:table-cell">
                  {short.views || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 hidden lg:table-cell">
                  {short.comments || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 hidden xl:table-cell">
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
