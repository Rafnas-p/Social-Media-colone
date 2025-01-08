"use client";

import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import { MyContext } from "../../context/vidoContext/VideoContext";

interface Short {
  channelId: { profile: string };
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  duration: number;
  isShort: boolean;
  profil: string;
  publicId: string;
  userId: string;
  userName: string;
  createdAt: string;
}
interface MyContextType {
  isOpen: boolean;
}

function DisplayShortsGrid() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [currentShortIndex, setCurrentShortIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const context = useContext(MyContext) as unknown as MyContextType | null;

  const isOpen = context?.isOpen ?? false;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const response = await axios.get("https://your-video-platform.onrender.com/api/entaireShorts");
        const shortsData = response.data.shorts || [];

        if (shortsData.length > 0) {
          const shuffledShorts = shortsData.sort(() => 0.5 - Math.random());
          setShorts(shuffledShorts.slice(0, 6));
        } else {
          setError("No shorts available to display.");
        }
      } catch (err) {
        console.error("Error fetching shorts:", err);
        setError("Failed to fetch shorts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, []);

  const closeModal = () => setCurrentShortIndex(null);

  const handleScroll = (e: React.WheelEvent) => {
    if (currentShortIndex !== null && modalRef.current) {
      if (e.deltaY > 0 && currentShortIndex < shorts.length - 1) {
        setCurrentShortIndex((prevIndex) => (prevIndex !== null ? prevIndex + 1 : null));
      } else if (e.deltaY < 0 && currentShortIndex > 0) {
        setCurrentShortIndex((prevIndex) => (prevIndex !== null ? prevIndex - 1 : null));
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div
      className={`flex flex-col transition-all duration-300  ${
        isOpen ? "ml-64" : "ml-16"
      } bg-white-100 min-h-screen`}
    >
      <div className="flex items-center space-x-2">
        <FaRegPlayCircle className="text-red-600 text-xl" />
        <h6 className="text-lg font-semibold">Shorts</h6>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-6 gap-2">
        {shorts.map((short, index) => (
          <div
            key={short._id}
            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg"
            onClick={() => setCurrentShortIndex(index)}
          >
            <video
              src={short.videoUrl}
              className="w-full h-full object-cover rounded-lg"
              muted
              loop
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            ></video>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
              <p className="truncate text-sm font-semibold">{short.title}</p>
              <p className="truncate text-xs">{short.userName}</p>
            </div>
          
          </div>
        ))}
      </div>

      {/* Modal Player */}
      {currentShortIndex !== null && shorts[currentShortIndex] && (
        <div
          className="fixed inset-0 bg-white flex items-center  justify-center z-50 overflow-hidden"
          onWheel={handleScroll}
          ref={modalRef}
          tabIndex={-1}
        >
          <div className="relative w-80 max-w-md p-4 rounded-lg ">
            <button
              className="absolute top-2 right-2 text-black hover:bg-gray-300 p-2"
              onClick={closeModal}
            >
              &times;
            </button>
            <video
              src={shorts[currentShortIndex].videoUrl}
              controls
              autoPlay
              className="w-full h-auto rounded-lg"
            ></video>
            <h3 className="text-lg font-semibold mt-2">
              {shorts[currentShortIndex].title}
            </h3>
            <p className="text-sm text-gray-600">{shorts[currentShortIndex].description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayShortsGrid;
