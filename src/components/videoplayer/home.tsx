"use client";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/vidoContext/VideoContext";
import Link from "next/link";
import Image from "next/image";

type Channel = {
  _id: string;
  handle: string;
  name: string;
  profile: string;
  subscribers: string[];
  totalSubscribers: number;
  userId: string;
  __v: number;
};

interface VideoDetails {
  channelId: Channel;
  uid: string;
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };
    fetchData();
  }, []);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { data } = context;

  return (
    <div
      className={`flex flex-col p-4 transition-all duration-300 mt-16 ${
        isOpen ? "ml-64" : "ml-4"
      } md:ml-16`}
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        ? "h-40 sm:h-32 md:h-28"
                        : "h-48 sm:h-40 md:h-36 lg:h-32"
                    } rounded-lg`}
                    src={item.videoUrl}
                    title={item.title}
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  ></video>
                </div>
              </Link>
              <div className="flex items-center space-x-4 p-2">
                <Link
                  href={`/userAcount/videos?username=${item.userName}`}
                  className="flex-shrink-0"
                >
                  <Image
                    src={item.channelId.profile}
                    alt="Profile"
                    className="rounded-full object-cover cursor-pointer"
                    width={32}
                    height={32}
                  />
                </Link>

                <Link href={`/videos/${item._id}`} className="flex-grow">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.channelId.name}
                    </p>
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
