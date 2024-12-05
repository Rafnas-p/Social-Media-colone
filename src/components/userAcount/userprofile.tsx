"use client";

import React, { useContext } from "react";
import { useSearchParams } from "next/navigation";
import { UserAuth } from "@/context/authcontext/authcontext";
import { MyContext } from "@/context/vidoContext/VideoContext";
import Link from "next/link";

// Define type for MyContextType if not already defined
interface MyContextType {
  isOpen: boolean;
}

// Define User type if not already defined
interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

const Userprofile: React.FC = () => {
  const context = useContext(MyContext) as MyContextType | null;

  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const { allUsers, user } = UserAuth();
  console.log("allUsers", allUsers);

  // Use `find` to get the first matching user
  const selectedUser = allUsers.find((u: User) => u.displayName === username);

  if (!selectedUser) {
    return <div>User not found</div>;
  }

  const { isOpen } = context || { isOpen: false }; // Handle null context

  const isCurrentUser = user?.displayName === selectedUser.displayName;

  return (
    <>
      <div
        className={`flex flex-row mt-28 space-y-4 ${
          isOpen ? "ml-60 mt-24" : "ml-32 mt-24"
        }`}
      >
        <img
          src={selectedUser.photoURL || "https://via.placeholder.com/600/61a65"}
          alt="Profile"
          className="w-28 h-28 rounded-full"
        />
        <div>
          <p className="text-lg font-medium ml-3">{selectedUser.displayName}</p>
          <p className="text-sm font-medium ml-3 text-gray-500">{selectedUser.email}</p>
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
          <Link href={`/userAcount/videos?username=${selectedUser.displayName}`}>
            Videos
          </Link>
          <Link
            href={`/userAcount/shorts?username=${selectedUser.displayName}`}
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
