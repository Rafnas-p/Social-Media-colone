"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";

interface Short {
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

function DisplayShorts() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [currentShortIndex, setCurrentShortIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);



  
  useEffect(() => {
    const fetchAllShorts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/entaireShorts"
        );

        const shortsData = response.data.shorts || [];
        setShorts(shortsData);

        if (shortsData.length > 0) {
          const randomIndex = Math.floor(Math.random() * shortsData.length);
          setCurrentShortIndex(randomIndex);
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

    fetchAllShorts();
  }, []);

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
    <div className="mt-14">
      {currentShortIndex !== null && shorts[currentShortIndex] && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80"
          onWheel={(e) => handleScroll(e)}
          ref={modalRef}
          tabIndex={-1}
        >
          <div className="relative w-1/5 h-full flex flex-col items-center">
            <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 text-white flex justify-between p-2 z-10">
              <button
                onClick={() =>
                  setCurrentShortIndex(Math.max(currentShortIndex - 1, 0))
                }
                className="text-sm px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Prev
              </button>
              <span>{shorts[currentShortIndex].title}</span>
              <button
                onClick={() =>
                  setCurrentShortIndex(
                    Math.min(currentShortIndex + 1, shorts.length - 1)
                  )
                }
                className="text-sm px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Next
              </button>
            </div>

            <video
              controls
              src={shorts[currentShortIndex].videoUrl}
              autoPlay
              className="w-full h-full object-cover"
            ></video>

            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg flex flex-col space-y-4">
              <Link
                href={`/userAcount?username=${shorts[currentShortIndex].userName}`}
                className="flex items-center space-x-2"
              >
                <img
                  src={shorts[currentShortIndex].profil}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover "
                />
                <span className="text-sm font-semibold">
                  {shorts[currentShortIndex].userName}
                </span>
              </Link>

              <p className="text-sm text-gray-300">
                {shorts[currentShortIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayShorts;
