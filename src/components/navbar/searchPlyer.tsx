"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MyContext } from '@/context/vidoContext/VideoContext';
const SearchPlyer: React.FC = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('Id');

  const context=useContext(MyContext)
   const {searchData}=context;
  const [data, setData] = useState<any>(null);

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
    <div className="flex flex-col px-4 mt-12 ml-2 bg-white-900 text-gray-800 min-h-screen">
      <div className="w-2/3 max-w-3xl  ml-16 mt-8">
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

      <div className="w-2/3 max-w-3xl mx-auto mt-8">
        {data ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <pre className="text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">No data found for this video ID.</p>
        )}
      </div>
    </div>

  );
};

export default SearchPlyer;
