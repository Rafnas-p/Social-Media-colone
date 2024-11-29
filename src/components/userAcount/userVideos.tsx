"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserAuth } from "@/context/authcontext/authcontext";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
}

const UserVideos: React.FC = () => {
  const { user } = UserAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // Modal state

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

  const openModal = (videoUrl: string) => {
    setSelectedVideo(videoUrl); // Set the video for modal
  };

  const closeModal = () => {
    setSelectedVideo(null); // Clear the modal
  };

  return (
    <div className="ml-16">
      <h2 className="text-xl font-bold mb-6">Your Videos</h2>
      {videos.length === 0 ? (
        <p className="text-gray-500">No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="space-y-2 rounded-lg cursor-pointer"
              onClick={() => openModal(video.videoUrl)}
            >
             <video
  src={video.videoUrl}
  controls
  className="w-full h-64 md:h-96 rounded-md"
></video>
              <h3 className="font-bold text-lg">{video.title}</h3>
              <p className="text-sm text-gray-500">{video.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 relative w-11/12 md:w-3/4 lg:w-1/2">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-500 text-lg font-bold"
            >
              &times;
            </button>
            <iframe
              src={`${selectedVideo}?autoplay=0&controls=1`}
              title="Selected Video"
              className="w-full h-64 md:h-96 rounded-md"
              frameBorder="0"
              allow="encrypted-media"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVideos;
