"use client";
import { useParams } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { MyContext } from '../vidoContext/VideoContext';

const VideoPlayer: React.FC = () => {
  const context = useContext(MyContext);

  if (!context) {
    return <div>Context is not available!</div>;
  }

  const { data } = context;
  const { videoId: initialVideoId } = useParams();
  const [currentVideoId, setCurrentVideoId] = useState(initialVideoId);

  const videoDetails = data.find((video) => video.id.videoId === currentVideoId);

  if (!videoDetails) {
    return <div>Video not found!</div>;
  }

  // Filter out the current video to show related videos
  const relatedVideos = data.filter((video) => video.id.videoId !== currentVideoId);

  return (
    <div className="flex px-4 mt-10">
      {/* Main Video and Details Section */}
      <div className="w-2/3 max-w-3xl space-y-4">
        <div className="w-full">
          <iframe
            className="w-full h-[500px] rounded-lg shadow-lg"
            src={`https://www.youtube.com/embed/${currentVideoId}`}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Video Details */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src={videoDetails.snippet.thumbnails.default.url}
              alt="Channel Logo"
              className="w-10 h-10 rounded-full"
            />
            <p className="text-base font-medium text-gray-800">{videoDetails.snippet.channelTitle}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-700">{videoDetails.snippet.title}</p>
          </div>
        </div>
      </div>

      {/* Related Videos Section */}
      <div className="w-1/3 pl-4 max-h-[500px] overflow-y-auto space-y-4">
        {relatedVideos.map((video) => (
          <div
            key={video.id.videoId}
            className="flex items-start space-x-3 cursor-pointer"
            onClick={() => setCurrentVideoId(video.id.videoId)} // Update main video on click
          >
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
              className="w-24 h-16 rounded-lg"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 line-clamp-2">{video.snippet.title}</p>
              <p className="text-xs text-gray-600">{video.snippet.channelTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
