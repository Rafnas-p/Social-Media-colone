"use client"; 

import React, { useContext, useState } from 'react';
import { MyContext } from '../vidoContext/VideoContext'; 

const DisplayData: React.FC = () => {
  const context = useContext(MyContext);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!context) {
    return <div>Loading...</div>; 
  }

  const { data } = context;

  return (
    <div className='ml-24'>
      <h2 className='text-2xl font-bold mb-6'>Video Results:</h2>
      {data.length === 0 ? (
        <p>No data found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                expandedIndex === index ? 'col-span-full' : ''
              }`}
              onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
            >
             
              <h3 className="text-lg font-semibold p-3 text-ellipsis overflow-hidden whitespace-nowrap">
                {item.snippet.title}
              </h3>

             
              <div className="video-container">
                <iframe
                  className={`w-full ${expandedIndex === index ? 'h-96' : 'h-40'}`} 
                  src={`https://www.youtube.com/embed/${item.id.videoId}`}
                  title={item.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

            
              <div className="flex items-center p-3 mt-3">
                <img
                  src={item.snippet.thumbnails.default.url} 
                  alt="Channel Logo"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.snippet.channelTitle}</p>
                  <p className="text-xs text-gray-600 truncate">{item.snippet.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayData;
