"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { Channel } from "../../context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext";
import axiosInstance from "@/app/fairbase/axiosInstance/axiosInstance";
import Image from "next/image";

interface User {
  _id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
interface Short {
  channelId:Channel
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
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
    const { user } = UserAuth() as unknown as { user: User | null };

  useEffect(() => {
    const fetchAllShorts = async () => {
      try {
        const response = await axios.get(
          "https://your-video-platform.onrender.com/api/entaireShorts"
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

 



  useEffect(() => {
    const fetchSubscribersCount = async () => {
      if (currentShortIndex === null || !shorts[currentShortIndex]) return;

      try {
        const response = await axios.post(
          "https://your-video-platform.onrender.com/api/getSubscribersCount",
          { channelId: shorts[currentShortIndex].channelId }
        );

        setSubscribers(response.data.totalSubscribers);
      } catch (error) {
        console.error("Error fetching subscriber count:", error);
      }
    };

    fetchSubscribersCount();
  }, [currentShortIndex, shorts]);

  
  const handilSubscrib = async () => {
    if (currentShortIndex === null || !shorts[currentShortIndex]) return;
    try {
      const response = await axiosInstance.post(
        "https://your-video-platform.onrender.com/api/subscribChannel",
        {
          _id:shorts[currentShortIndex].channelId
        }
      );
      setSubscribers(response.data.subscribers || []);
    }  catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error("Error:", err.message);
      } else {
        console.error("An unknown error occurred:", err);
      }
    }
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
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, [currentShortIndex]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const isUserSubscribed =
    Array.isArray(subscribers) && subscribers.includes(user?.uid ||"");

  return (
    <div className="mt-18">
    {currentShortIndex !== null && shorts[currentShortIndex] && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80"
        onWheel={handleScroll}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="relative w-[340px] sm:w-[350px] h-5/6  flex flex-col mt-10 items-center">
          <video
            controls
            src={shorts[currentShortIndex].videoUrl}
            autoPlay
            className="w-full h-full object-cover rounded-lg"
          ></video>
  
          <div className="absolute bottom-16 left-1 text-white p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <Link
                href={`/userAcount?username=${shorts[currentShortIndex].userName}`}
                className="flex items-center space-x-2"
              >
                <Image
                  src={shorts[currentShortIndex].channelId?.profile}
                  alt="Profile"
                  className=" rounded-full object-cover"
                  width={28}
                  height={28}
                />
                <span className="text-sm font-semibold">
                  {shorts[currentShortIndex].userName}
                </span>
              </Link>
              <button
                onClick={handilSubscrib}
                className={`${
                  isUserSubscribed ? "bg-white text-black" : "bg-black text-white"
                } rounded-full w-24 h-8 text-sm px-4 transition-all duration-300`}
              >
                {isUserSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              {shorts[currentShortIndex].description}
            </p>
          </div>
        </div>
  
        {currentShortIndex < shorts.length - 1 && (
          <div className="absolute bottom-2 w-full flex justify-center">
            <div
              className="w-[340px] sm:w-[350px] h-3 bg-black bg-opacity-90 text-white rounded-md flex items-center justify-center cursor-pointer"
              onClick={() => setCurrentShortIndex(currentShortIndex + 1)}
            >
            
               <video
            src={shorts[currentShortIndex+1].videoUrl}
            muted
            className="w-full h-full object-cover rounded-lg"
          ></video>
             
            </div>
          </div>
        )}
      </div>
    )}
  </div>
  
  );
}

export default DisplayShorts;
