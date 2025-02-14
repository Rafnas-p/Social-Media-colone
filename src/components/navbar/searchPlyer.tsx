"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MyContext } from "@/context/vidoContext/VideoContext";
import { UserAuth } from "@/context/authcontext/authcontext";
import axios from "axios";
import Cookies from "js-cookie";
import RelativeTime from "../reusebile/relativeTime";
import Link from "next/link";
import axiosInstance from "@/app/fairbase/axiosInstance/axiosInstance";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import Image from "next/image";
interface VideoId {
  kind: string;
  videoId: string;
  createdAt: string;
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
interface User {
  _id: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
interface SearchDataItem {
  _id: string;
  channelId: Channel;
  id: VideoId;
  videoId: string;
  title: string;
  description: string;
  userName: string;
  photoURL: string;
  displayName: string;
  createdAt: string; 

  videoUrl: string;
}

interface Comment {
  userName: ReactNode;
  createdAt(createdAt: string): React.ReactNode;
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

  const [videoComments, setVideoComments] = useState<Comment[]>([]);
  const [playVideo, setPlayVideo] = useState<SearchDataItem | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [subscribe, setSubscribe] = useState("");
  const [liked, setLiked] = useState<string>("");
  
  const [like, setLike] = useState<string[]>([]);
    const [dislike, setDislike] = useState<string[]>([]);
    const [subscribers, setSubscribers] = useState<string[]>([]);
  const token = Cookies.get("token");
  const mongoDbId = Cookies.get("mongoDbId");
    const { user } = UserAuth() as unknown as { user: User | null };
  const { channels } = context;

  useEffect(() => {
    const fetchVideoById = async () => {
      if (!videoId) return;
      try {
        const response = await axios.get(
          `https://your-video-platform.onrender.com/api/video/${videoId}`
        );
        setPlayVideo(response.data);
      } catch (error) {
        console.error("Error fetching video details:", error);
        setPlayVideo(null);
      }
    };

    fetchVideoById();
  }, [videoId]);

console.log('play video',playVideo);


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
      setFilteredData(data as []);
    }
  }, [data, setFilteredData]);

 
  useEffect(() => {
    const fetchLikes = async () => {
      if (!playVideo) return;

      try {
        const response = await axios.post(
          "https://your-video-platform.onrender.com/api/likeVideoCount",
          {
            _id: playVideo._id,
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
  }, [playVideo, user?._id]);

  const handleLike = async () => {
    if (!playVideo || !user?._id) return;
console.log(playVideo,user?._id);

    try {
      const response = await axiosInstance.post(
        "https://your-video-platform.onrender.com/api/likeVideo",
        {
          channelId: playVideo._id,

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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const islike = Array.isArray(like) && like.includes(user?._id ||"");

  const handilDislike = async () => {
    if (!playVideo?._id) return; 

    try {
      const response = await axiosInstance.post(
        "https://your-video-platform.onrender.com/api/dislikeVideo",
        {
          channelId: playVideo?._id,

        }
      );
      setLike(response.data.likes);
      setLiked(response.data.dislikes);
      setDislike(response.data.dislikarray);
    } catch (error) {
      console.error("Error disliking the video:", error);
    }
  };

  const isdislike = Array.isArray(dislike) && dislike.includes(user?._id ||"");

  useEffect(() => {
    const fetchComments = async () => {
      if (!videoId) return;
      try {
        const response = await axios.get(
          `https://your-video-platform.onrender.com/api/getCommentsById/${videoId}`
        );
        setVideoComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [videoId]);

  useEffect(() => {
    const fetchSubscribersCount = async () => {
      if (!playVideo) return;

      try {
        const response = await axios.post(
          "https://your-video-platform.onrender.com/api/getSubscribersCount",
          { channelId: playVideo.channelId }
        );

        setSubscribe(response.data.subscribersCount);
        setSubscribers(response.data.totalSubscribers);
      } catch (error) {
        console.error("Error fetching subscriber count:", error);
      }
    };

    fetchSubscribersCount();
  }, [playVideo, user?.uid]);

  const postComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(
        `https://your-video-platform.onrender.com/api/addComment/${videoId}`,
        {
          userName: channels?.name,
          userProfile: channels?.profile,
          text: newComment,
        }
      );

      setVideoComments((prev) => [...prev, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleVideoClick = (id:  string) => {
    router.push(`?Id=${id}`);
  };

  const handilSubscrib = async () => {
    if (!playVideo?._id) return; 

    try {
      const response = await axiosInstance.post(
        "https://your-video-platform.onrender.com/api/subscribChannel",
        {
          _id: playVideo.channelId._id,
        }
      );
      setSubscribers(response.data.subscribers || []);
    }catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const isUserSubscribed =
    Array.isArray(subscribers) && subscribers.includes(user?.uid ||"");
  console.log("isUserSubscribed", isUserSubscribed);

  return (
  <div className="flex flex-col md:flex-row px-4 mt-12 bg-white text-gray-800 min-h-screen">
  <div className="w-full md:w-2/3 md:max-w-3xl mx-auto md:ml-16 mt-8">
    {playVideo ? (
      <div className="w-full bg-black rounded-xl overflow-hidden shadow-md">
        <video
          className="w-full h-[200px] md:h-[400px] object-cover"
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
      <div className="flex justify-between items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
        <div className="flex items-center">
          <Link
            href={`/userAcount/videos?username=${playVideo?.channelId.name}`}
            className="flex items-center space-x-4"
          >
            <Image
              src={playVideo?.channelId.profile || '/default-profile.png'}
              alt="Profile"
              className=" rounded-full object-cover"
              width={32}
              height={32}
            />
            <div className="flex flex-col">
              <h4 className="font-semibold">{playVideo?.channelId.name}</h4>
              <p className="text-sm text-gray-500">{subscribe} subscribers</p>
            </div>
          </Link>
          <button
            onClick={handilSubscrib}
            className={`${
              isUserSubscribed
                ? "bg-gray-100 max-w-28 h-8 text-gray-600"
                : "bg-black text-white"
            } rounded-full w-28 h-9 ml-10 text-sm p-1 transition-all duration-300`}
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
        
      
    </div>

    <div className="mt-6">
      <h2 className="text-lg font-semibold">Comments</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 mt-3">
        <Image
          src={
            channels?.profile ||
            user?.photoURL ||
            "https://via.placeholder.com/150?text=Default+Image"
          }
          alt="User Profile"
          className="rounded-full object-cover"
          width={40}
          height={40}
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border-b border-gray-300 focus:border-black px-3 py-2 text-sm outline-none transition w-full"
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
              <Image
                src={comment?.userProfile}
                className=" rounded-full object-cover"
                alt="User Profile"

                width={32}
                height={32}
              />
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{comment.userName}</p>
                  <p className="text-xs ml-1 text-gray-500">
                    <RelativeTime
                      dateString={
                        comment.createdAt as unknown as string | number
                      }
                    />
                  </p>
                </div>
                <p className="text-sm">{comment?.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  </div>

  <div className="w-full md:w-1/3 mt-8 md:pl-4 space-y-4 overflow-y-auto">
    {filteredData.length > 0 ? (
      filteredData.map((video, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 cursor-pointer"
          onClick={() => handleVideoClick(video._id as string)}
        >
          <div className="w-28 h-16 rounded-lg overflow-hidden bg-black">
            <video
              className="w-full h-full object-cover"
              src={video.videoUrl}
              title="Related Video"
            ></video>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold line-clamp-2">{video.title}</p>
            <p className="text-xs text-gray-500">
              <RelativeTime
                dateString={video.createdAt as unknown as string | number}
              />
            </p>
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
