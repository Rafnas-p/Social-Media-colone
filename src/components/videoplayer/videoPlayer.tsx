
"use client";

import { useParams } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../../context/vidoContext/VideoContext';

interface VideoDetails {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}
interface CommentSnippet {
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        publishedAt: string;
        textDisplay: string;
      };
    };
  };
  id: string;
}

interface MyContextType {
  data: VideoDetails[];
  comments: CommentSnippet[];
  fetchComments: (videoId: string) => void;
}

const VideoPlayer: React.FC = () => {
  const context = useContext(MyContext) as unknown as MyContextType | null;

  if (!context) {
    return <div>Context is not available!</div>;
  }
  
  const { data, comments, fetchComments } = context;

  const { videoId: initialVideoId } = useParams() as { videoId: string | undefined };
  const [currentVideoId, setCurrentVideoId] = useState<string | undefined>(initialVideoId);
  const [newComment, setNewComment] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('Newest First');

  useEffect(() => {
    if (currentVideoId) {
      fetchComments(currentVideoId);
    }
  }, [currentVideoId, fetchComments]);

  const videoDetails = data.find((video) => video.id.videoId === currentVideoId);

  if (!videoDetails) {
    return <div>Video not found!</div>;
  }

  const relatedVideos = data.filter((video) => video.id.videoId !== currentVideoId);

  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.snippet.topLevelComment.snippet.publishedAt).getTime();
    const dateB = new Date(b.snippet.topLevelComment.snippet.publishedAt).getTime();
    return sortOption === 'Newest First' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="flex px-4 mt-16 ml-14 bg-white-700 text-gray-800 min-h-screen">
      <div className="w-2/3 max-w-3xl space-y-4">
        <div className="w-full">
          <iframe
            className="w-full h-[400px] rounded-xl"
            src={`https://www.youtube.com/embed/${currentVideoId}`}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src={videoDetails.snippet.thumbnails.default.url}
              alt="Channel Logo"
              className="w-10 h-10 rounded-full"
            />
            <p className="text-base font-medium">{videoDetails.snippet.channelTitle}</p>
          </div>
          <p className="text-sm">{videoDetails.snippet.title}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">
            Comments ({comments.length})
          </h4>

          <div className="flex items-center space-x-2 mb-4">
            <span>Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-gray-700 p-1 rounded border border-gray-300"
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border-none rounded mb-2 focus:outline-none focus:ring-0"
            />
            <button className="px-4 py-2 bg-black-500 text-white rounded">
              Comment
            </button>
          </div>

          {sortedComments.length === 0 ? (
            <p>No comments available for this video.</p>
          ) : (
            sortedComments.map((comment) => {
              const topLevelComment = comment.snippet.topLevelComment.snippet;
              return (
                <div key={comment.id} className="pb-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={topLevelComment.authorProfileImageUrl}
                      alt={topLevelComment.authorDisplayName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{topLevelComment.authorDisplayName}</p>
                      <p className="text-sm">{topLevelComment.textDisplay}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button className="text-xs hover:text-blue-600">Reply</button>
                        <button className="text-xs hover:text-blue-600">Like</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="w-1/3 pl-4 overflow-y-auto space-y-4">
        {relatedVideos.map((video) => (
          <div
            key={video.id.videoId}
            className="flex items-start space-x-3 cursor-pointer"
            onClick={() => setCurrentVideoId(video.id.videoId)}
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
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
