"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { UserAuth } from "@/context/authcontext/authcontext";
import Link from "next/link";
import axiosInstance from "@/app/fairbase/axiosInstance/axiosInstance";
import { AxiosError } from "axios";


type User = {
  _id: string;
  displayName: string;
  email: string;
  photoURL: string;
  channelName: string;
  subscribedChannels: string[];
  uid: string;
  createdAt: string;
  __v: number;
};


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
  likes: string[];                 
  dislikes: string[];               
  publicId: string;                
  userId: string;                   
  videoId: string;                  
  kind: string;                     
  etag: string;                     
  id: {
    kind: string;
    videoId: string;
  };    
}


function Dashbord() {
  const context = useContext(MyContext);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>(context?.userVideos||[]);
  const isOpen = context?.isOpen ?? false;
    const { user } = UserAuth() as unknown as { user: User | null };

    useEffect(() => {
      const fetchVideosById = async () => {
        try {
          
          const response = await axiosInstance.get("http://localhost:5000/api/videos", {
            params: { userId: user?._id },
          });
  
          setVideos(response.data.videos);
        }  catch (err: unknown) {
          if (err instanceof AxiosError) {
            console.error("Axios error fetching videos:", err.message);
          } else {
            console.error("Error fetching videos:", err);
          }
        
      }
      
    }
      fetchVideosById();
    }, [user?._id]);

  if (!context) {
    console.error(
      "MyContext is not defined. Ensure the provider wraps this component."
    );
    return null;
  }
  console.log('videossss',videos);
  


  const handleDelete = async (videoId: string) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:5000/api/deleatVideoById/${videoId}`
      );
      console.log("Delete response:", response);

      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
    }catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Axios error fetching videos:", err.message);
      } else {
        console.error("Error fetching videos:", err);
      }
    }
  };

  const toggleDropdown = (videoId: string) => {
    setDropdownOpen((prev) => (prev === videoId ? null : videoId));
  };

  return (
    <div
      className={`flex flex-col p-6 transition-all duration-300 ${
        isOpen ? "ml-64" : "ml-16"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="border px-4 py-2">Shorts</th>
              <th className="border px-4 py-2 hidden sm:table-cell">Visibility</th>
              <th className="border px-4 py-2 hidden sm:table-cell">Restrictions</th>
              <th className="border px-4 py-2 hidden sm:table-cell">Date</th>
              <th className="border px-4 py-2 hidden sm:table-cell">Views</th>
              <th className="border px-4 py-2 hidden sm:table-cell">Comments</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video._id} className="even:bg-gray-100 odd:bg-white">
                <td className="flex border border-gray-300 px-4 py-2 items-center space-x-4 relative">
                  <video className="w-40 h-24 flex-shrink-0">
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                  <div className="w-full">
                    <p className="font-medium truncate">
                      {video.title || "No Title"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {video.description.length > 20
                        ? `${video.description.slice(0, 20)}...`
                        : video.description}
                    </p>
                  </div>
                  <div className="absolute right-4 top-4">
                    <button
                      className="relative"
                      onClick={() => toggleDropdown(video._id)}
                    >
                      <BsThreeDotsVertical className="text-gray-600 cursor-pointer" />
                    </button>
                    {dropdownOpen === video._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md">
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="block w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                        <Link
                          href={`/edit/${video._id}`}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                </td>
                <td className="border px-4 py-2 text-center hidden sm:table-cell">
                  {video.visibility || "Public"}
                </td>
                <td className="border px-4 py-2 text-center hidden sm:table-cell">
                  {video.restrictions || "None"}
                </td>
                <td className="border px-4 py-2 text-center hidden sm:table-cell">
                  {new Date(video.createdAt || Date.now()).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 text-center hidden sm:table-cell">
                  {video.views || 0}
                </td>
                <td className="border px-4 py-2 text-center hidden sm:table-cell">
                  {video.comments || 0}
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
