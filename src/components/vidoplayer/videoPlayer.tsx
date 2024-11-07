"use client";
import { useParams } from 'next/navigation';
import React, { useContext } from 'react';
import { MyContext } from '../vidoContext/VideoContext';

const VideoPlayer: React.FC = () => {
  const context = useContext(MyContext);

  
  if (!context) {
    return <div>Context is not available!</div>;
  }

  const { data } = context;
  const { videoId } = useParams(); 
 
  const videoDetails = data.find((video) => video.id.videoId === videoId);

  
  if (!videoDetails) {
    return <div>Video not found!</div>;
  }

  return (
    <div className="flex justify-center mt-20 px-4">
      
      <div className="w-full max-w-4xl space-y-6">
        
        
        <div className="w-full">
          <iframe
            className="w-full h-96 rounded-lg shadow-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
        
            <img
              src={videoDetails.snippet.thumbnails.default.url}
              alt="Channel Logo"
              className="w-12 h-12 rounded-full"
            />

            
            <p className="text-lg font-semibold text-gray-800">{videoDetails.snippet.channelTitle}</p>
          </div>
          
        
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-600">{videoDetails.snippet.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
