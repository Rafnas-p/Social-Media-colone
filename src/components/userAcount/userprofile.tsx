"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UserAuth } from "@/context/authcontext/authcontext";
import { MyContext } from "@/context/vidoContext/VideoContext";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

interface MyContextType {
  isOpen: boolean;
}

interface User {
  name: string | null;
  _id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

type Channel = {
  _id: string;
  handle: string;
  name: string;
  profile: string;
  subscribers: string[];
  totalSubscribers: number;
  userId: string;
  __v: number;
};

const Userprofile: React.FC = () => {
  const context = useContext(MyContext) as MyContextType | null;
  const [channels, setChannels] = useState<Channel[]>([]);

  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const { user } = UserAuth() as unknown as { user: User  };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get<Channel[]>(
          "https://your-video-platform.onrender.com/api/getChannelsByName",
          {
            params: { userName: username },
          }
        );
        setChannels(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("Axios error:", err.response?.data || err.message);
        } else if (err instanceof Error) {
          console.error("Error:", err.message);
        } else {
          console.error("An unknown error occurred:", err);
        }
      }
    };

    if (username) {
      fetchChannels();
    }
  }, [username]);


  console.log("channels", channels);

  const selectedUser = channels.find((channel: Channel) => channel.name === username);

  if (!selectedUser) {
    return <div>User not found</div>;
  }


  const { isOpen } = context || { isOpen: false };

  const isCurrentUser = user?._id === selectedUser.userId;
console.log('selectedUser',channels);

  return (
    <>
      <div
        className={`flex flex-row mt-28 space-y-4 ${
          isOpen ? "ml-60 mt-24" : "ml-32 mt-24"
        }`}
      >
       <Image
  src={selectedUser.profile || '/path/to/default-image.jpg'} 
  alt="Profile"
  width={112} 
  height={112}
  className="w-28 h-28 rounded-full"
/>
        <div>
          <h1 className=" text-3xl from-neutral-950 p-1 ml-3">
            {selectedUser.name}
          </h1>
          <span className="flex flex-row items-center space-x-4 ml-3">
            <p className="text-sm font-medium text-gray-500 ml-1">
              {selectedUser.handle}
            </p>
            <p className="text-sm font-medium text-gray-500">
              {selectedUser.totalSubscribers} subscribers
            </p>
          </span>

          {isCurrentUser && (
            <span>
              <button className="px-4 text-gray-500">Customize Channel</button>
              <Link href="/channal" className="text-gray-500 bg-gray-50  px-1 py-1 rounded-lg">
                Manage Videos
              </Link>
            </span>
          )}
        </div>
      </div>
      {isOpen ? 
      <div className="ml-64 mt-6">
        <span>
          <Link href={`/userAcount/videos?username=${selectedUser.name}`}>
            Videos
          </Link>
          <Link
            href={`/userAcount/shorts?username=${selectedUser.name}`}
            className="ml-3"
          >
            Shorts
          </Link>
        </span>
      </div>
      : <div className="ml-24 mt-6">
      <span>
        <Link href={`/userAcount/videos?username=${selectedUser.name}`}>
          Videos
        </Link>
        <Link
          href={`/userAcount/shorts?username=${selectedUser.name}`}
          className="ml-3"
        >
          Shorts
        </Link>
      </span>
    </div> }
      <hr className="border-gray" />
      <div className="mt-6 px-6"></div>
    </>
  );
};

export default Userprofile;
