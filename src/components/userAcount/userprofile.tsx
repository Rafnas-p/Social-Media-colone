"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UserAuth } from "@/context/authcontext/authcontext";
import { MyContext } from "@/context/vidoContext/VideoContext";
import Link from "next/link";
import axios from "axios";

interface MyContextType {
  isOpen: boolean;
}

interface User {
  name: string | null;
  displayName: string;
  email: string;
  photoURL: string;
}

const Userprofile: React.FC = () => {
  const context = useContext(MyContext) as MyContextType | null;
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const { user } = UserAuth();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/getChannelsByName",
          {
            params: { userName: username },
          }
        );
        setChannels(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch channels.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchChannels();
    }
  }, [username]);

  const selectedUser = channels.find((u: User) => u.name === username);

  if (!selectedUser) {
    return <div>User not found</div>;
  }

  const { isOpen } = context || { isOpen: false };

  const isCurrentUser = user?._id === selectedUser.userId;

  return (
    <>
      <div
        className={`flex flex-row mt-28 space-y-4 ${
          isOpen ? "ml-60 mt-24" : "ml-32 mt-24"
        }`}
      >
        <img
          src={selectedUser.profile}
          alt="Profile"
          className="w-28 h-28 rounded-full"
        />
        <div>
          <h1 className=" text-3xl from-neutral-950 p-1 ml-3">
            {selectedUser.name}
          </h1>
          <span className="flex flex-row items-center space-x-4 ml-3">
            <p className="text-sm font-medium text-gray-500 ml-1">
              {selectedUser.handil}
            </p>
            <p className="text-sm font-medium text-gray-500">
              {selectedUser.totalSubscribers} subscribers
            </p>
          </span>

          {isCurrentUser && (
            <span>
              <button className="px-4 text-gray-500">Customize Channel</button>
              <Link href="/channal" className="text-gray-500">
                Manage Videos
              </Link>
            </span>
          )}
        </div>
      </div>
      <div className="ml-24 mt-6">
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
      <hr className="border-gray" />
      <div className="mt-6 px-6"></div>
    </>
  );
};

export default Userprofile;
