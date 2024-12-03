"use client";

import { useParams } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../context/vidoContext/VideoContext';

import axios from 'axios';

interface VideoDetails {
  createdAt: string;
  description: string;
  duration: number;
  publicId: string;
  title: string;
  userId: string;
  videoUrl: string;
  __v: number;
  _id: string;
  
}
interface RelatedVideos{
  createdAt: string;
  description: string;
  duration: number;
  publicId: string;
  title: string;
  userId: string;
  videoUrl: string;
  __v: number;
  _id: string;
}
interface CommentSnippet {
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        publishedAt: string;
        textDisplay: string;
      };
    };
  };
  id: string;
}

interface MyContextType {
  data: VideoDetails[];
  comments: CommentSnippet[];
  fetchComments: (videoId: string) => void;
}

const VideoPlayer: React.FC = () => {
  const context = useContext(MyContext) as unknown as MyContextType | null;

  if (!context) {
    return <div>Context is not available!</div>;
  }

  const { data } = context;
  const { videoId: routeVideoId } = useParams() as { videoId: string | undefined };

  const [currentVideoId, setCurrentVideoId] = useState<string | undefined>(routeVideoId);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);

  // Fetch video details by ID
  useEffect(() => {
    const fetchVideoById = async () => {
      if (!currentVideoId) return;
      try {
        const response = await axios.get<VideoDetails>(`http://localhost:5000/api/video/${currentVideoId}`);
        setVideoDetails(response.data);
      } catch (error) {
        console.error("Error fetching video details:", error);
        setVideoDetails(null);
      }
    };

    fetchVideoById();
  }, [currentVideoId]);

  if (!videoDetails) {
    return <div>Loading or Video not found!</div>;
  }

  const relatedVideos:VideoDetails[] = data.filter((video) => video._id !== currentVideoId);
console.log("videodetails",videoDetails);

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
    <div className="flex flex-col lg:flex-row px-4 mt-20 ml-14 bg-white text-gray-800 min-h-screen space-y-4 lg:space-y-0 lg:space-x-6">
    {/* Main Video Player Section */}
    <div className="w-full lg:w-2/3 max-w-3xl space-y-4">
      <div className="w-full bg-black rounded-xl overflow-hidden shadow-md">
        <video
          className="w-full h-[400px] object-cover"
          src={videoDetails.videoUrl}
          title="Video Player"
          controls
        ></video>
      </div>
  
      <div className="flex flex-col space-y-3">
        <h1 className="text-lg font-bold">{videoDetails.title}</h1>
        <p className="text-sm">{videoDetails.description}</p>
      </div>
    </div>
  
    {/* Related Videos Section */}
    <div className="w-full lg:w-1/3 pr-11 ">
      {relatedVideos.map((video) => (
        <div
          key={video._id}
          className="flex items-center space-x-2 bg-white p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setCurrentVideoId(video._id)}
        >
          {/* Video Thumbnail */}
          <div className="w-28 h-16 rounded-lg overflow-hidden bg-black">
            <video
              className="w-full h-full object-cover"
              src={video.videoUrl}
              title="Related Video"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            ></video>
          </div>
  
          {/* Video Details */}
          <div className="flex-1">
            <p className="text-sm font-semibold line-clamp-2">{video.title}</p>
            <p className="text-xs text-gray-500">Duration: {video.duration} mins</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default VideoPlayer;
