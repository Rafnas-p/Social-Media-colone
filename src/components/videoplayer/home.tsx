"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext";
import Link from "next/link";

interface VideoDetails {
  channelId: any;
  uid: any;
  createdAt: string;
  description: string;
  duration: number;
  publicId: string;
  title: string;
  userId: string;
  videoUrl: string;
  __v: number;
  _id: string;
  profil: string;
  userName: string;
}



interface MyContextType {
  data: VideoDetails[];
  isOpen: boolean;
}

const DisplayData: React.FC = () => {
  const context = useContext(MyContext) as unknown as MyContextType | null;
  const isOpen = context?.isOpen ?? false;
  const [loading, setLoading] = useState<boolean>(true);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { data } = context;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div
      className={`flex flex-col p-6 transition-all duration-300 mt-20 ${
        isOpen ? "ml-64" : "ml-16"} bg-white-100 min-h-screen`}
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg p-4 flex flex-col space-y-4"
              >
                <div className="w-full h-40 bg-gray-300 rounded-lg"></div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded-md w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded-md w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600">No data found</p>
      ) : (
        <div className="grid grid-cols-1 rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-white">
          {data.map((item, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 overflow-hidden rounded-lg"
            >
              <Link href={`/videos/${item._id}`} passHref>
                <div className="overflow-hidden rounded-lg relative">
                  <video
                    className={`w-full object-cover ${
                      isOpen
                        ? "h-48 sm:h-40 md:h-32 lg:h-28"
                        : "h-56 sm:h-48 md:h-44 lg:h-40"
                    } rounded-lg`}
                    src={item.videoUrl}
                    title={item.title}
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  ></video>
                </div>
              </Link>
              <div className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Link
                  href={`/userAcount/videos?username=${item.userName}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={item.channelId.profile}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  />
                </Link>

                <Link href={`/videos/${item._id}`} className="flex-grow">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.userName} </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayData;
