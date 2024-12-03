"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { UserAuth } from "@/context/authcontext/authcontext";

interface Short {
  _id: string;
  description: string;
  videoUrl: string;
  publicId: string;
  userId: string;
  duration: number;
  title: string;
  category: string;
  isShort: boolean;
  createdAt: string;
}

function UserShorts() {
  const { user } = UserAuth();
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentShortIndex, setCurrentShortIndex] = useState<number | null>(
    null
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchShorts = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/shorts", {
          params: { userId: user.uid },
        });
        setShorts(response.data.shorts);
      } catch (err) {
        console.error("Error fetching shorts:", err);
        setError("Failed to fetch shorts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, [user?.uid]);

  const openModal = (index: number) => {
    setCurrentShortIndex(index);
  };

  const closeModal = () => {
    setCurrentShortIndex(null);
  };

  const handleScroll = (e: React.WheelEvent) => {
    if (currentShortIndex === null) return;

    const nextIndex =
      e.deltaY > 0
        ? Math.min(currentShortIndex + 1, shorts.length - 1)
        : Math.max(currentShortIndex - 1, 0);

    setCurrentShortIndex(nextIndex);
  };

  useEffect(() => {
    if (currentShortIndex !== null && modalRef.current) {
      modalRef.current.focus();
    }
  }, [currentShortIndex]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Your Shorts</h2>
      {Array.isArray(shorts) && shorts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {shorts.map((short, index) => (
            <div
              key={short._id}
              className="border rounded-lg p-2  shadow-lg bg-black cursor-pointer"
              onClick={() => openModal(index)}
            >
    
              <video
                src={short.videoUrl}
                className="w-full h-96 rounded-md"
                autoPlay={false}
              ></video>
              <h3 className="text-md font-semibold">{short.title}</h3>
              <p className="text-sm text-gray-600">{short.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No shorts available.</p>
      )}

      
      {currentShortIndex !== null && shorts[currentShortIndex] && (
        <div
          className="fixed inset-0 bg-white flex items-center justify-center z-50 overflow-hidden"
          onWheel={handleScroll}
          ref={modalRef}
          tabIndex={-1}
        >
          <div className="bg-black rounded-lg p-4 relative w-96">
            <button
              className="absolute top-2 right-2 text-black p-2 hover:bg-gray-300"
              onClick={closeModal}
            >
              &times;
            </button>
           
            <video
              src={shorts[currentShortIndex].videoUrl}
              controls
              autoPlay
              className="w-96 h-full rounded-md"
            ></video>
            
            <h3 className="text-lg font-semibold">
              {shorts[currentShortIndex].title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {shorts[currentShortIndex].description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserShorts;
