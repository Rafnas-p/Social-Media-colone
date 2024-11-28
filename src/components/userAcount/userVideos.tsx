"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserAuth } from "@/context/authcontext/authcontext";

interface Video {
  _id: string;
  title: string;
  description: string;
  url: string;
}

const UserVideos: React.FC = () => {
  const { user } = UserAuth();

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

  return (
    <div className="ml-16">
      <h2 className="text-xl font-bold mb-6">Your Videos</h2>
      {videos.length === 0 ? (
        <p className="text-gray-500">No videos found.</p>
      ) : (
        <div className="space-y-6">
          {videos.map((video) => (
            <div key={video._id} className="space-y-2 rounded-lg">
            
              <iframe
                src={video.videoUrl}
                title={video.title}
                width="250"
                height="250"
              />
                <h3 className="font-bold text-lg">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserVideos;
