"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext";
import axios from "axios";
import Link from "next/link";

interface VideoId {
  kind: string;
  videoId: string;
}

interface SearchDataItem {
  channelId: any;
  id: VideoId;
  videoId: string;
  title: string;
  description: string;
  userName: string;
  photoURL: string;
  displayName: string;
  videoUrl: string;
}

interface Comment {
  createdAt(createdAt: any): React.ReactNode;
  userProfile: string;
  id: string;
  text: string;
  author: string;
  publishedAt: string;
}

const SearchPlayer: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoId = searchParams.get("Id");

  const context = useContext(MyContext);
  if (!context) {
    throw new Error("MyContext is not available");
  }

  const { data, filteredData, setFilteredData } = context;

  const [currentVideo, setCurrentVideo] = useState<SearchDataItem | null>(null);
  const [videoComments, setVideoComments] = useState<Comment[]>([]);
  const [playVideo, setPlayVideo] = useState<SearchDataItem | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  const { user } = UserAuth();
  const { channels } = context;
  const channel=channels.length !== 0;
  
  useEffect(() => {
    const fetchVideoById = async () => {
      if (!videoId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/video/${videoId}`
        );
        setPlayVideo(response.data);
      } catch (error) {
        console.error("Error fetching video details:", error);
        setPlayVideo(null);
      }
    };

    fetchVideoById();
  }, [videoId]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      localStorage.setItem("filteredData", JSON.stringify(filteredData));
    }
  }, [filteredData]);

  useEffect(() => {
    const storedFilteredData = localStorage.getItem("filteredData");
    if (storedFilteredData) {
      setFilteredData(JSON.parse(storedFilteredData));
    } else if (data && data.length > 0) {
      setFilteredData(data);
    }
  }, [data, setFilteredData]);

  useEffect(() => {
    if (videoId && data) {
      const video = data.find((item) => item.videoId === videoId);
      setCurrentVideo(video || null);
    }
  }, [videoId, data]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!videoId) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getCommentsById/${videoId}`
        );
        setVideoComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [videoId]);

  
  const postComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/addComment/${videoId}`,
        {
          userId: user?.uid,
          userName: user?.displayName,
          userProfile: user?.photoURL,
          text: newComment,
        }
      );

      setVideoComments((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleVideoClick = (id: string) => {
    router.push(`?Id=${id}`);
  };

  function getRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime(); 
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30); 
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    }
  }

  return (
    <div className="flex px-4 mt-12 ml-2 bg-white-900 text-gray-800 min-h-screen">
      <div className="w-2/3 max-w-3xl ml-16 mt-8">
        {playVideo ? (
          <div className="w-full bg-gray-100 p-4 rounded-xl shadow-lg">
            <video
              className="w-full h-[400px] rounded-xl"
              src={playVideo.videoUrl}
              title="Video player"
             controls
            ></video>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading video...</p>
        )}

        <div className="flex flex-col mt-4">
          <h1 className="text-lg font-bold">{playVideo?.title}</h1>
          <p className="text-sm">{playVideo?.description}</p>
        </div>

        <div className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 mt-6">
          <Link
            href={`/userAcount?username=${playVideo?.userName}`}
            className="flex items-start space-x-4 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <img
              src={ playVideo?.channelId ? playVideo?.channelId.profile: playVideo?.userId.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
            />
            <h4>{playVideo?.userName  }</h4>
          </Link>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Comments</h2>
          <div className="flex items-center space-x-2 mt-3">
            <img
              src={channel? channels.profile:user?.photoURL }
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border-b border-gray-300 focus:border-black px-3 py-2 text-sm outline-none transition"
            />
            <button
              onClick={postComment}
              className="text-black font-medium hover:bg-blue-50 px-4 py-1 rounded transition"
            >
              Post
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {videoComments.length > 0 ? (
              videoComments.map((comment, index) => (
                <div key={comment.id || index} className="flex items-start space-x-3">
                  <img
                    src={comment.userProfile || "/default-profile.png"}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="text-sm">{comment.text}</p>
                    <p className="text-xs text-gray-500">
                    {getRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="w-1/3 pl-4 mt-8 space-y-4 overflow-y-auto">
        {filteredData.length > 0 ? (
          filteredData.map((video, index) => (
            <div
              key={video._id|| index}
              className="flex items-start space-x-3 cursor-pointer"
              onClick={() => handleVideoClick(video._id)}
            >
              <div className="w-28 h-16 rounded-lg overflow-hidden bg-black">
                <video
                  className="w-full h-full object-cover"
                  src={video.videoUrl || ""}
                  title="Related Video"
                ></video>
              </div>
              <div>
                <p className="text-sm font-semibold line-clamp-2">{video.title}</p>
                <p className="text-xs">{video.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No videos to display</p>
        )}
      </div>
    </div>
  );
};

export default SearchPlayer;
