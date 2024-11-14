"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MyContext } from '@/context/vidoContext/VideoContext';

const SearchPlyer: React.FC = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('Id');

  const context = useContext(MyContext);
  const { filteredData } = context;

  console.log('filterdvid',filteredData);
  
  const [data, setData] = useState<any>(null);

  // Fetch data based on videoId
  useEffect(() => {
    if (videoId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/comments?query=${videoId}`);
          if (!response.ok) throw new Error('Failed to fetch data');
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [videoId]);

  return (
    <div className="flex px-4 mt-12 ml-2 bg-white-900 text-gray-800 min-h-screen">
      {/* Video Player Section */}
      <div className="w-2/3 max-w-3xl ml-16 mt-8">
        {videoId ? (
          <div className="w-full bg-gray-100 p-4 rounded-xl shadow-lg">
            <iframe
              className="w-full h-[400px] rounded-xl"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading video...</p>
        )}
      </div>
       

      <div className="w-1/3 pl-4 mt-8 space-y-4 overflow-y-auto">
       
        
          {filteredData.map((video) => (
            <div
              key={video.id.videoId}
              className="flex items-start space-x-3 cursor-pointer"
              onClick={() => window.location.href = `?Id=${video.id.videoId}`} // Change video on click
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className="w-24 h-16 rounded-lg"
              />
              <div>
                <p className="text-sm font-semibold line-clamp-2">{video.snippet.title}</p>
                <p className="text-xs">{video.snippet.channelTitle}</p>
              </div>
            </div>
          ))}
       
      </div>
    </div>
  );
};

export default SearchPlyer;
