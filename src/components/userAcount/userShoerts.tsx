"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
  useEffect(() => {
    const fetchShorts = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true); 
        const response = await axios.get("http://localhost:5000/api/shorts", {
          params: { userId: user.uid },
        });
        setShorts(response.data.shorts);
        console.log(response.data.shorts);
      } catch (err) {
        console.error("Error fetching shorts:", err);
        setError("Failed to fetch shorts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, [user?.uid]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shorts.map((short) => (
            <div
              key={short._id}
              className="border rounded-lg p-2 shadow-lg bg-white"
            >
              <h3 className="text-md font-semibold">{short.title}</h3>
              <p className="text-sm text-gray-600">{short.description}</p>
              <video
                src={short.videoUrl}
                controls
                className="w-full h-64 md:h-96 rounded-md"
              ></video>
              <div className="mt-2 text-sm text-gray-500">
                Duration: {short.duration.toFixed(2)} seconds
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No shorts available.</p>
      )}
    </div>
  );
}

export default UserShorts;
