"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserAuth } from "@/context/authcontext/authcontext";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
}
interface MyContextType {
  isOpen: boolean;
}

const UserVideos: React.FC = () => {
  const context = useContext(MyContext) as unknown as MyContextType | null;

  const { allUsers } = UserAuth();
  const searchParams = useSearchParams();
  const isOpen = context?.isOpen ?? false;

  const username = searchParams.get("username");
  const user = allUsers.find((user) => user.displayName === username);

  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!user?.uid) return;
        const response = await axios.get("http://localhost:5000/api/videos", {
          params: { userId: user.uid },
        });

        setVideos(response.data.videos);
      } catch (err: any) {
        setError(err.message || "Failed to fetch videos.");
      }
    };

    fetchVideos();
  }, [user?.uid]);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleMouseEnter = (event: React.MouseEvent<HTMLVideoElement>) => {
    const videoElement = event.currentTarget;
    videoElement.play();
  };
  const handleMouseLeave = (event: React.MouseEvent<HTMLVideoElement>) => {
    const videoElement = event.currentTarget;
    videoElement.pause();
    videoElement.currentTime = 0;
  };
  return (
    <div
      className={`flex flex-col p-6 transition-all duration-300  ${
        isOpen ? "ml-64" : "ml-16"
      } bg-white-100 min-h-screen`}
    >
      {videos.length === 0 ? (
        <p className="text-gray-500">No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {videos.map((video) => (
            <div key={video._id}>
              <Link href={`/videos/${video._id}`} passHref>
                <video
                  src={video.videoUrl}
                  className="w-full  rounded-md"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                ></video>
                <h3 className="font-bold text-lg">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.description}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserVideos;
