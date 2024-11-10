"use client";
import React, { createContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { fetchDataFromApi, featchCommentsAPi } from '../../components/utils/youtubeApi';

// Define context type
interface MyContextType {
  selectedcat: string;
  setselectedcat: (newValue: string) => void;
  data: Video[];
  comments: Comment[];
  fetchComments: (videoId: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Define video and comment types
interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  channelTitle: string;
}

interface Video {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: VideoSnippet;
}

interface CommentSnippet {
  id: string;
  kind: string;
  snippet: {
    canReply: boolean;
    channelId: string;
    isPublic: boolean;
    topLevelComment: {
      id: string;
      kind: string;
      snippet: {
        textDisplay: string;
        authorChannelId: { value: string };
        authorChannelUrl: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        canRate: boolean;
        likeCount: number;
        publishedAt: string;
        textOriginal: string;
        updatedAt: string;
        videoId: string;
        viewerRating: string;
      };
    };
    totalReplyCount: number;
    videoId: string;
  };
}

interface Comment {
  kind: string;
  etag: string;
  id: string;
  snippet: CommentSnippet;
}

interface MyProviderProps {
  children: ReactNode;
}

export const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [selectedcat, setselectedcat] = useState<string>("New");
  const [data, setData] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch videos based on selected category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromApi('search', {
          q: selectedcat,
          part: 'snippet',
          type: 'video',
          maxResults: 20,
        });
        setData(response);
        console.log('Fetched data:', response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedcat]);

  // Use useCallback for fetchComments to optimize performance
  const fetchComments = useCallback(async (videoId: string) => {
    try {
      const response = await featchCommentsAPi(videoId);
      setComments(response);
      console.log('Fetched comments:', response);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, []);

  return (
    <MyContext.Provider value={{
      selectedcat,
      setselectedcat,
      data,
      comments,
      fetchComments,
      isOpen,
      toggleSidebar,
    }}>
      {children}
    </MyContext.Provider>
  );
};
