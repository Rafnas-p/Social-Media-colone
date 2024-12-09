"use client";

import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../../context/vidoContext/VideoContext";
import { useParams, useRouter } from "next/navigation"; 
import { UserAuth } from "@/context/authcontext/authcontext";
import axios from "axios";
import Link from "next/link";

const VideoPlayer: React.FC = () => {
  const context = useContext(MyContext);
  const { videoId: routeVideoId } = useParams();
  const router = useRouter();  
  const [currentVideoId, setCurrentVideoId] = useState<string | undefined>(
    routeVideoId
  );
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [comments, setComments] = useState<CommentSnippet[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { user } = UserAuth();

  useEffect(() => {
    const fetchVideoById = async () => {
      if (!currentVideoId) return;
      try {
        const response = await axios.get<VideoDetails>(
          `http://localhost:5000/api/video/${currentVideoId}`
        );
        setVideoDetails(response.data);
      } catch (error) {
        console.error("Error fetching video details:", error);
        setVideoDetails(null);
      }
    };

    fetchVideoById();
  }, [currentVideoId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!currentVideoId) return;
      try {
        const response = await axios.get<CommentSnippet[]>(
          `http://localhost:5000/api/getCommentsById/${currentVideoId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [currentVideoId]);

  const postComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/addComment/${currentVideoId}`,
        {
          userId: user?.uid,
          userName: user?.displayName,
          userProfile: user?.photoURL,
          text: newComment,
        }
      );

      setComments((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (!videoDetails) {
    return <div>Loading or Video not found!</div>;
  }
  console.log("currentVideoId", currentVideoId);

  const handleVideoClick = (videoId: string) => {
    setCurrentVideoId(videoId); 
    router.push(`/videos/${videoId}`); 
  };
  function getRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date; // Difference in milliseconds
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate months
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
    <div className="flex flex-col lg:flex-row px-4 mt-20 ml-14 bg-white text-gray-800 min-h-screen space-y-4 lg:space-y-0 lg:space-x-6">
      <div className="w-full lg:w-2/3 max-w-3xl space-y-4">
        <div className="w-full bg-black rounded-xl overflow-hidden shadow-md">
          <video
            className="w-full h-[400px] object-cover"
            src={videoDetails.videoUrl}
            title="Video Player"
            controls
          ></video>
        </div>

        <div className="flex flex-col ">
          <h1 className="text-lg font-bold">{videoDetails.title}</h1>
          <p className="text-sm">{videoDetails.description}</p>
        </div>
        <div className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <Link
            href={`/userAcount?username=${videoDetails.userName}`}
            className="flex items-start space-x-4  hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <img
              src={user?.photoURL || ""}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
            />
            <h4>{user?.displayName}</h4>
          </Link>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Comments</h2>
          <div className="flex items-center space-x-2 mt-3">
            <img
              src={videoDetails?.profil || "/default-profile.png"} 
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover"
            />

            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="  flex-1 border-b border-gray-300 focus:border-black px-3 py-2 text-sm outline-none transition"
            />

            {/* Post Button */}
            <button
              onClick={postComment}
              className="text-black font-medium hover:bg-blue-50 px-4 py-1 rounded transition"
            >
              Post
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <img
                  src={user?.photoURL || ""}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{comment.userName}</p>
                  <p className="text-sm">{comment.text}</p>
                  <p className="text-xs text-gray-500">
                    {getRelativeTime(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="w-full lg:w-1/3 pr-11">
        {context.data
          .filter((video) => video._id !== currentVideoId)
          .map((video) => (
            <div
              key={video._id}
              className="flex items-center space-x-2 bg-white p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleVideoClick(video._id)}   
            >
              <div className="w-28 h-16 rounded-lg overflow-hidden bg-black">
                <video
                  className="w-full h-full object-cover"
                  src={video.videoUrl}
                  title="Related Video"
                ></video>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold line-clamp-2">
                  {video.title}
                </p>
                <p className="text-xs text-gray-500">
                    {getRelativeTime(video.createdAt)}
                  </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
