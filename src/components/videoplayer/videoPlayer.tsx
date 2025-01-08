"use client";

import React, { useContext, useState, useEffect, ReactNode } from "react";
import { MyContext } from "../../context/vidoContext/VideoContext";
import { useParams, useRouter } from "next/navigation";
import { AiOutlineDislike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import axiosInstance from "@/app/fairbase/axiosInstance/axiosInstance";
import Cookies from "js-cookie";
import { UserAuth } from "@/context/authcontext/authcontext";
import RelativeTime from "../reusebile/relativeTime";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
interface User {
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
interface VideoDetails {
  uid: string;
  userId: string | null;
  likes: number|string;
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
  channelId: Channel;
}



interface CommentSnippet {
  _id: string;
  userName: string;
  userProfile: string;
  text: string;
  createdAt: string;
}

type DropdownId = string | number | null;

const VideoPlayer: React.FC = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("MyContext must be used within a provider");
  }

  const { videoId: routeVideoId } = useParams() as { videoId?: string };
  const router = useRouter();
  const [currentVideoId, setCurrentVideoId] = useState<string | undefined>(
    routeVideoId
  );
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [comments, setComments] = useState<CommentSnippet[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<DropdownId>(null);

  const [liked, setLiked] = useState<string>("");
  const [like, setLike] = useState<string[]>([]);
  const [dislike, setDislike] = useState<string[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [subscribe, setSubscribe] = useState("");
  const { user } = UserAuth() as unknown as { user: User | null };

  const { channels } = context;

  const token = Cookies.get("token");
  const mongoDbId = Cookies.get("mongoDbId");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideoById = async () => {
      if (!currentVideoId) return;
      try {
        const response = await axios.get<VideoDetails>(
          `https://your-video-platform.onrender.com/api/video/${currentVideoId}`
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
          `https://your-video-platform.onrender.com/api/getCommentsById/${currentVideoId}`
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
          "https://your-video-platform.onrender.com/api/likeVideoCount",
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
    const fetchSubscribersCount = async (): Promise<void> => {
      if (!videoDetails || !videoDetails.channelId) return;
  
      try {
        const response = await axios.post("https://your-video-platform.onrender.com/api/getSubscribersCount", {
          channelId: videoDetails.channelId,
        });
  
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
      const currentChannel = channels ? channels : null;
  
      const response = await axiosInstance.post<CommentSnippet>(
        `https://your-video-platform.onrender.com/api/addComment/${currentVideoId}`,
        {
          userName: currentChannel ? currentChannel.name : user?.displayName,
          userProfile: currentChannel ? currentChannel.profile : user?.photoURL,
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
        "https://your-video-platform.onrender.com/api/likeVideo",
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

  const islike = Array.isArray(like) && like.includes(user?._id || "");

  const handilDislike = async () => {
    if (!user?._id) {
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "https://your-video-platform.onrender.com/api/dislikeVideo",
        {
          channelId: videoDetails._id,
        }
      );
      setLike(response.data.likes);
      setLiked(response.data.dislikes);
      setDislike(response.data.dislikarray);
    } catch (error) {
      console.error("Error disliking the video:", error);
    }
  };

  const isdislike = Array.isArray(dislike) && dislike.includes(user?._id || "");

  const handilSubscrib = async () => {
    if (!user?._id) {
      setIsModalOpen(true);
      return;
    }
    try {
      const response = await axiosInstance.post(
        "https://your-video-platform.onrender.com/api/subscribChannel",
        {
          _id: videoDetails.channelId._id,
        }
      );
      setSubscribers(response.data.subscribers || []);
    } catch (error) {
      console.error("Errorsubscrib channel:", error);
    }
  };

  const isUserSubscribed =
    Array.isArray(subscribers) && subscribers.includes(user?.uid || "");
  console.log("isUserSubscribed", isUserSubscribed);

  const toggleDropdown = (id: DropdownId) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };
  const handleDelete = async (_id: string) => {
    try {
      const response = await axiosInstance.delete(
        `https://your-video-platform.onrender.com/api/deleteComment/${_id}`
      );

      console.log("Comment deleted:", response.data);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== _id)
      );
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
              <Image
                src={videoDetails?.channelId.profile}
                alt="Profile"
                className=" rounded-full object-cover cursor-pointer"
                width={38}
                height={38}
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
            <Image
              src={
                channels?.profile ||
                user?.photoURL ||
                "https://via.placeholder.com/150?text=Default+Image"
              }
              alt="User Profile"
              className=" rounded-full object-cover"
              width={32}
              height={32}
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
                <Image
                  src={comment?.userProfile}
                  alt={comment.userName}
                  className=" rounded-full object-cover"
                  width={32}
                  height={32}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mr-9">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold">
                        {comment.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        <RelativeTime dateString={comment?.createdAt} />
                      </p>
                    </div>
                    <div className="relative">
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
          .filter((video) => video._id !== currentVideoId && video._id != null)
          .map((video) => (
            <div
              key={video._id as string}
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
