"use client";

import React, { useContext, useState, useEffect, ReactNode } from "react";
import { MyContext } from "../../context/vidoContext/VideoContext";
import { useParams, useRouter } from "next/navigation";
import { AiOutlineDislike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import axiosInstance from "@/app/fairbase/axiosInstance/axiosInstance";
import Cookies from "js-cookie";

import { UserAuth } from "@/context/authcontext/authcontext";
import RelativeTime from "../reusebile/RelativeTime";
import axios from "axios";
import Link from "next/link";
interface User {
  _id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

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
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [liked, setLiked] = useState<string>("");
  const [like, setLike] = useState([]);
  const [dislike, setdisLike] = useState([]);
  const [subscribe, setSubscribe] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const { user } = UserAuth() as { user: User | null };
  const { channels } = context;
  const channel = channels.length !== 0;
  const token = Cookies.get("token");
  const mongoDbId = Cookies.get("mongoDbId");
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!context) {
    throw new Error("MyContext must be used within a provider");
  }

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

  useEffect(() => {
    const fetchLikes = async () => {
      if (!videoDetails) return;

      try {
        const response = await axios.post(
          "http://localhost:5000/api/likeVideoCount",
          {
            _id: videoDetails._id,
          }
        );

        setLiked(response.data.likesCount);
        setLike(response.data.likes);
      } catch (error) {
        console.error("Error liking the video:", error);
      }
    };

    fetchLikes();
  }, [videoDetails]);

  useEffect(() => {
    const fetchSubscribersCount = async () => {
      if (!videoDetails) return;

      try {
        const response = await axios.post(
          "http://localhost:5000/api/getSubscribersCount",
          { channelId: videoDetails.channelId }
        );

        setSubscribe(response.data.subscribersCount);
        setSubscribers(response.data.totalSubscribers);
      } catch (error) {
        console.error("Error fetching subscriber count:", error);
      }
    };

    fetchSubscribersCount();
  }, [videoDetails, user?.uid]);

  const postComment = async () => {
    if (!user?._id) {
      setIsModalOpen(true);
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post<CommentSnippet>(
        `http://localhost:5000/api/addComment/${currentVideoId}`,
        {
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
  const handleLike = async () => {
    if (!user?._id) {
      setIsModalOpen(true);
      return;
    }

    if (!videoDetails || !user?._id) return;

    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/likeVideo",
        {
          channelId: videoDetails._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-MongoDb-Id": mongoDbId,
          },
        }
      );

      setLiked(response.data.likesCount);
      setLike(response.data.likes);
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
    if (!user?._id) {
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/dislikeVideo",
        {
          channelId: videoDetails._id,
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
    if (!user?._id) {
      setIsModalOpen(true);
      return;
    }
    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/subscribChannel",
        {
          _id: videoDetails.channelId._id,
        }
      );
      setSubscribers(response.data.subscribers || []);
    } catch (error: any) {
      console.error("Errorsubscrib channel:", error);
    }
  };

  const isUserSubscribed =
    Array.isArray(subscribers) && subscribers.includes(user?.uid);
  console.log("isUserSubscribed", isUserSubscribed);

  const toggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id)); 
  };
  const handleDelete = async (_id: string) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:5000/api/deleteComment/${_id}` 
      );
  
      console.log("Comment deleted:", response.data);
  
      setComments((prevComments) => prevComments.filter(comment => comment._id !== _id));
    } catch (error: any) {
      console.error("Error in delete comment:", error);
    }
  };
  
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
              href={`/userAcount/videos?username=${videoDetails?.channelId.name}`}
              className="flex items-center space-x-4"
            >
              <img
                src={videoDetails?.channelId.profile}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />

              <div className="flex flex-col">
                <h4 className="font-semibold">
                  {videoDetails?.channelId.name}
                </h4>
                <p className="text-sm text-gray-500">{subscribe} subscribers</p>
              </div>
            </Link>
            <button
              onClick={handilSubscrib}
              className={`${
                isUserSubscribed
                  ? "bg-gray-100 max-w-28 h-8 text-gray-600"
                  : "bg-black text-white"
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
              <AiOutlineDislike className={isdislike ? "text-red-500" : ""} />
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-md shadow-lg w-64">
              <h2 className="text-lg font-semibold mb-2 text-center">
                Login Required
              </h2>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Sign in to make your opinion count.{" "}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Comments</h2>
          <div className="flex items-center space-x-3 mt-3">
            <img
              src={
                channel?.profile ||
                user?.photoURL ||
                "https://via.placeholder.com/150?text=Default+Image"
              }
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-black px-3 w-full py-2 text-sm outline-none transition"
              />
            </div>
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
                  src={comment?.userProfile}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mr-9">
                    <p className="text-sm font-semibold">{comment.userName}</p>
                    <div className="relative ">
                      <button
                        onClick={() => toggleDropdown(comment._id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ⋮
                      </button>
                      {openDropdownId === comment._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-md z-10">
                        
                          <button
                            onClick={() => {
                              handleDelete(comment._id);
                              setOpenDropdownId(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mt-1">{comment?.text}</p>
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
                  <RelativeTime dateString={video.createdAt} />
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
