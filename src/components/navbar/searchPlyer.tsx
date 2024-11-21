"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MyContext } from "@/context/vidoContext/VideoContext";

interface Thumbnails {
  default: { url: string; width: number; height: number };
}

interface Snippet {
  channelId: string;
  channelTitle: string;
  description: string;
  liveBroadcastContent: string;
  publishTime: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  title: string;
}

interface VideoId {
  kind: string;
  videoId: string;
}

interface SearchDataItem {
  id: VideoId;
  snippet: Snippet;
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

  const { searchData, filteredData, setFilteredData, fetchComments,  } = context;

  const [currentVideo, setCurrentVideo] = useState<SearchDataItem | null>(null);
  const [videoComments, setVideoComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      localStorage.setItem("filteredData", JSON.stringify(filteredData));
    }
  }, [filteredData]);

  useEffect(() => {
    const storedFilteredData = localStorage.getItem("filteredData");
    if (storedFilteredData) {
      setFilteredData(JSON.parse(storedFilteredData));
    } else if (searchData && searchData.length > 0) {
      setFilteredData(searchData);
    }
  }, [searchData, setFilteredData]);

  useEffect(() => {
    if (videoId && searchData) {
      const video = searchData.find((item) => item.id.videoId === videoId);
      setCurrentVideo(video || null);
    }
  }, [videoId, searchData]);

  useEffect(() => {
    if (currentVideo) {
      fetchComments(currentVideo.id.videoId)
        .then((commentsData) => {
          setVideoComments(commentsData);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    }
  }, [currentVideo, fetchComments]);

  const handleVideoClick = (id: string) => {
    router.push(`?Id=${id}`)
  };

  return (
    <div className="flex px-4 mt-12 ml-2 bg-white-900 text-gray-800 min-h-screen">
      <div className="w-2/3 max-w-3xl ml-16 mt-8">
        {currentVideo ? (
          <div className="w-full bg-gray-100 p-4 rounded-xl shadow-lg">
            <iframe
              className="w-full h-[400px] rounded-xl"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading video...</p>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Comments</h2>
          {videoComments?.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {videoComments?.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg shadow-sm">
                  <p className="text-sm font-semibold">{comment.author}</p>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.publishedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-1/3 pl-4 mt-8 space-y-4 overflow-y-auto">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((video) => (
            <div
              key={video.id.videoId}
              className="flex items-start space-x-3 cursor-pointer"
              onClick={() => handleVideoClick(video.id.videoId)}
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                className="w-24 h-16 rounded-lg"
              />
              <div>
                <p className="text-sm font-semibold line-clamp-2">{video.snippet.title}</p>
                <p className="text-xs">{video.snippet.channelTitle}</p>
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
