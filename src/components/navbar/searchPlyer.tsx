"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext";
import axios from "axios";

interface VideoId {
  kind: string;
  videoId: string;
}

interface SearchDataItem {
  id: VideoId;
}

interface Comment {
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

  const { data, filteredData, setFilteredData, fetchComments } = context;

  const [currentVideo, setCurrentVideo] = useState<SearchDataItem | null>(null);
  const [videoComments, setVideoComments] = useState<Comment[]>([]);
  const [playVideo, setPlayVideo] = useState<{ videoUrl: string } | null>(null);
  const [newComment, setNewComment] = useState<string>("");

  const { user } = UserAuth();

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

  function getRelativeTime(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime(); // Difference in milliseconds
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate months
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    }
  }


  return (
    <div className="flex px-4 mt-12 ml-2 bg-white-900 text-gray-800 min-h-screen">
      <div className="w-2/3 max-w-3xl ml-16 mt-8">
        {playVideo ? (
          <div className="w-full bg-gray-100 p-4 rounded-xl shadow-lg">
            <iframe
              className="w-full h-[400px] rounded-xl"
              src={playVideo.videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading video...</p>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Comments</h2>
          <div className="flex items-center space-x-2 mt-3">
            <img
              src={user?.photoURL || "/default-profile.png"} // Replace with actual user profile image
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
   {Array.isArray(videoComments) && videoComments.length > 0 ? (
     videoComments.map((comment) => (
       <div key={comment.id} className="flex items-start space-x-3">
         <img
           src={user?.photoURL || ""}
           alt={comment.author}
           className="w-8 h-8 rounded-full object-cover"
         />
         <div>
           <p className="text-sm font-semibold">{comment.author}</p>
           <p className="text-sm">{comment.text}</p>
           <p className="text-xs text-gray-500">
             {getRelativeTime(comment.publishedAt)}
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
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((video) => (
            <div
              key={video._id} // Use _id as the unique key
              className="flex items-start space-x-3 cursor-pointer"
              onClick={() => handleVideoClick(video._id)} // Correct navigation
            >
              <div className="w-28 h-16 rounded-lg overflow-hidden bg-black">
                <video
                  className="w-full h-full object-cover"
                  src={video.videoUrl}
                  title="Related Video"
                ></video>
              </div>
              <div>
                <p className="text-sm font-semibold line-clamp-2">
                  {video.title}
                </p>
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
