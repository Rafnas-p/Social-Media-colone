"use client";

import React, { useContext, useState, useEffect, ReactNode } from "react";
import { MyContext } from "../../context/vidoContext/VideoContext";
import { useParams, useRouter } from "next/navigation";
import { AiOutlineDislike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import axiosInstance from "@/app/fairbase/axiosInstance/axiosInstance";
import Cookies from "js-cookie";
import { UserAuth } from "@/context/authcontext/authcontext";
import axios from "axios";
import Link from "next/link";

interface VideoDetails {
  uid: any;
  userId: string | null;
  likes: any;
  name: ReactNode;
  totalSubscribers: ReactNode;
  photoURL: string;
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  userName: string;
  profil: string | null;
  createdAt: string;
  videoDetails: VideoDetails;
  channelId: any;
}

interface CommentSnippet {
  _id: string;
  userName: string;
  userProfile: string;
  text: string;
  createdAt: string;
}

interface MyContextType {
  data: VideoDetails[];
  isOpen: boolean;
}

const VideoPlayer: React.FC = () => {
  const context = useContext<MyContextType>(MyContext);
  const { videoId: routeVideoId } = useParams() as { videoId?: string };
  const router = useRouter();
  const [currentVideoId, setCurrentVideoId] = useState<string | undefined>(
    routeVideoId
  );
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [comments, setComments] = useState<CommentSnippet[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [liked, setLiked] = useState<string>("");
  const [like, setLike] = useState([]);
  const [dislike, setdisLike] = useState([]);
  const [subscribe, setSubscribe] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const { user } = UserAuth();
  const { channels } = context;
  const channel = channels.length !== 0;
  const token = Cookies.get("token");
  const mongoDbId = Cookies.get("mongoDbId");

  if (!context) {
    throw new Error("MyContext must be used within a provider");
  }

  // Fetch video details
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

  // Fetch like count
  useEffect(() => {
    const fetchLikes = async () => {
      if (!videoDetails) return;

      try {
        const response = await axios.post(
          "http://localhost:5000/api/likeVideoCount",
          {
            _id: videoDetails._id,
            uid: user?._id,
          }
        );

        setLiked(response.data.likesCount);
        setLike(response.data.likes);
      } catch (error) {
        console.error("Error liking the video:", error);
      }
    };

    fetchLikes();
  }, [videoDetails, user?._id]);

  console.log("videoDetails", videoDetails);

  useEffect(() => {
    const fetchSubscribersCount = async () => {
      if (!videoDetails) return;

      try {
        const response = await axios.post(
          "http://localhost:5000/api/getSubscribersCount",
          { channelId: videoDetails.channelId }
        );

        setSubscribe(response.data.subscribersCount);
        setSubscribers(response.data.subscribers || []);
      } catch (error) {
        console.error("Error fetching subscriber count:", error);
      }
    };

    fetchSubscribersCount();
  }, [videoDetails, user?.uid]);

  const postComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post<CommentSnippet>(
        `http://localhost:5000/api/addComment/${currentVideoId}`,
        {
          userId: channels ? channels.userId : user?._id,
          userName: channels ? channels.name : user?.displayName,
          userProfile: channels ? channels.profile : user?.photoURL,
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

  const handleVideoClick = (videoId: string) => {
    setCurrentVideoId(videoId);
    router.push(`/videos/${videoId}`);
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

  const handleLike = async () => {
    if (!videoDetails || !user?._id) return;

    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/likeVideo",
        {
          _id: videoDetails._id, // MongoDB ID of the video
          uid: user?._id, // User ID from your authentication
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT Token
            "X-MongoDb-Id": mongoDbId, // MongoDB ID as a custom header
          },
        }
      );

      setLiked(response.data.likesCount); // Update the likes count
      setLike(response.data.likes); // Update the like status
    } catch (error: any) {
      console.error("Error liking the video:", error);
      if (error.response) {
        console.error("Response error:", error.response);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const islike = Array.isArray(like) && like.includes(user?._id);

  const handilDislike = async () => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/dislikeVideo",
        {
          _id: videoDetails._id,
          uid: user?._id,
        }
      );
      setLike(response.data.likes);
      setLiked(response.data.dislikes);
      setdisLike(response.data.dislikarray);
    } catch (error) {
      console.error("Error disliking the video:", error);
    }
  };

  const isdislike = Array.isArray(dislike) && dislike.includes(user?._id);

  const handilSubscrib = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/subscribChannel",
        {
          channelId: channels._id,
          uid: user?.uid,
        }
      );
      setSubscribers(response.data.subscribers || []);
    } catch (error: any) {
      console.error("Errorsubscrib channel:", error);
    }
  };
  const isUserSubscribed =
    Array.isArray(subscribers) && subscribers.includes(user?.uid);
console.log('videoDetails',videoDetails);

  return (
    <div className="flex  flex-col lg:flex-row px-4 mt-20 ml-14 bg-white text-gray-800 min-h-screen space-y-4 lg:space-y-0 lg:space-x-6">
      <div className="w-full lg:w-2/3 max-w-3xl space-y-4">
        <div className="w-full bg-black rounded-xl overflow-hidden shadow-md">
          <video
            className="w-full h-[400px] object-cover"
            src={videoDetails.videoUrl}
            title="Video Player"
            controls
          ></video>
        </div>
        <div className="flex iteflex-col ">
          <h1 className="text-lg font-bold">{videoDetails.title}</h1>
        </div>
        <div className="flex justify-between items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <div className="flex">
            <Link
              href={`/userAcount?username=${videoDetails.userName}`}
              className="flex items-center space-x-4"
            >
              <img
                src={videoDetails?.userId?.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />

              <div className="flex flex-col">
                <h4 className="font-semibold">{videoDetails?.userName}</h4>
                <p className="text-sm text-gray-500">{subscribe} subscribers</p>
              </div>
            </Link>
            <button
              onClick={handilSubscrib}
              className={`${
                isUserSubscribed ? "bg-white text-black" : "bg-black text-white"
              } rounded-full w-27 h-9 ml-10 text-sm p-1 transition-all duration-300`}
            >
              {isUserSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          <div className="flex border focus:ring-2  bg-gray-50 w-28 h-8 rounded-full overflow-hidden cursor-pointer">
            <button
              onClick={handleLike}
              className="p-3 rounded-r-none border-r bg-gray-100 flex-1 flex justify-center items-center cursor-pointer"
            >
              <AiOutlineLike
                className={islike ? "text-red-500" : "text-gray-500"}
              />

              <p>{liked}</p>
            </button>
            <button
              onClick={handilDislike}
              className="p-3 rounded-l-none bg-gray-100 flex-1 flex justify-center items-center"
            >
              <AiOutlineDislike
                className={isdislike ? "text-red-500" : ""} // Use isdislike for conditional styling
              />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Comments</h2>
          <div className="flex items-center space-x-2 mt-3">
            <img
              src={channel ? channels.profile : user?.photoURL}
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
            {comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <img
                  src={comment?.userProfile }
                  alt={channels ? channels.name : comment.userName}
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
