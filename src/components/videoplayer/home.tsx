"use client";
import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../context/vidoContext/VideoContext';
import Link from 'next/link';

const DisplayData: React.FC = () => {
  const context = useContext(MyContext);
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
        isOpen ? 'ml-64' : 'ml-16'
      } bg-white-100 min-h-screen`}
    >
      {loading ? (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg p-4"
              >
                <div className="w-full h-48 bg-gray-300 rounded-lg"></div>
                <div className="flex items-start mt-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded-md w-full mt-2"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600">No data found</p>
      ) : (
    
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <div key={index} className="transform transition-all duration-300">
               <Link href={`/videos/${item.id.videoId}`} passHref>
              <div className="overflow-hidden rounded-lg">  
                <iframe
                  className={`w-full ${
                    isOpen
                      ? 'h-48 sm:h-40 md:h-32 lg:h-28'
                      : 'h-56 sm:h-48 md:h-44 lg:h-40'
                  } rounded-lg`}
                  src={`https://www.youtube.com/embed/${item.id.videoId}`}
                  title={item.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

             
                <div className="flex items-start p-4 cursor-pointer">
                  <img
                    src={item.snippet.thumbnails.default.url}
                    alt="Channel Logo"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {item.snippet.title}
                    </p>
                    <p className="text-xs font-medium text-gray-700 mt-1">
                      {item.snippet.channelTitle}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.snippet.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayData;
