"use client";
import React, { createContext, useCallback, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { UserAuth } from "@/context/authcontext/authcontext";
import { Key } from 'readline';
import { get } from 'http';

interface SearchDataItem {
  kind: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: string;
    publishedAt: string;
    title: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
  };
}

interface MyContextType {
  selectedcat: string;
  setselectedcat: (newValue: string) => void;
  data: Video[];
  comments?: Comment[]; // Optional property
  fetchComments?: (videoId: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  searchData?: SearchDataItem[]; // Optional property
  loading: boolean;
  error: string | null;
  filteredData: SearchItem[];
  setFilteredData: (data: SearchItem[]) => void;
  userVideos: Video[];
  shorts: Video[];
  channels: any[]; // Add channels here
}



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
  _id: Key | null | undefined;
  videoUrl: string | undefined;
  title: string;
  description: string;
  visibility: string;
  restrictions: string;
  createdAt: number;
  views: number;
  comments: number;
  likes: number;
  dislikes: number;
  videoId: string;
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: VideoSnippet;
}


interface MyProviderProps {
  children: ReactNode;
}
type SearchItem = {
  videoId: number;
  description: ReactNode;
  title: ReactNode;
  videoUrl: string | undefined;
  _id: Key | null | undefined;
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
  };
};


export const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [selectedcat, setselectedcat] = useState<string>("New");
  const [data, setData] = useState<Video[]>([]);
 
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<SearchItem[]>([]);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [shorts, setShorts] = useState<Video[]>([]);
   const [channels, setChannels] = useState<any[]>([]);
    const [like,setLike]=useState<any[]>(0)
  
  const { user } = UserAuth();


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    
  };

  
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/EntairVideos");
        console.log("Response from API:", response.data);
  
        if (response.data && response.data.videos) {
          setData(response.data.videos);
          console.log("Updated data state:", response.data.videos);
        } else {
          console.error("Invalid API response format");
        }
        setLoading(false);
      } catch (err:any) {
        console.error("Error fetching videos:", err.message);
        setError(err.message || "Failed to fetch videos");
        setLoading(false);
      }
    };
  
    fetchAllVideos();
  }, []);


  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/getchannel",
          {
            params: { ownerId: user?.uid },
          }
        );
        setChannels(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch channels.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchChannels();
    }
  }, [user?.uid]);

  console.log("channels", channels);


  useEffect(() => {
    const fetchVideosById = async () => {
      try {
        if (!user?.uid) return;
        const response = await axios.get("http://localhost:5000/api/videos", {
          params: { uid: user.uid },
        });

        setUserVideos(response.data.videos);
      } catch (err: any) {
        setError(err.message || "Failed to fetch videos.");
      }
    };

    fetchVideosById();
  }, [user?.uid]);

  useEffect(() => {
    const fetchShorts = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/shorts", {
          params: { userId: user.uid },
        });
        setShorts(response.data.shorts);
      } catch (err) {
        console.error("Error fetching shorts:", err);
        setError("Failed to fetch shorts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, [user?.uid]);



  

  return (
    <MyContext.Provider value={{
      selectedcat,
      setselectedcat,
      data,
      isOpen,
      toggleSidebar,
      loading,
       error,
       filteredData, 
       setFilteredData,
       userVideos,
       shorts,
       channels,
    }}>
      {children}
    </MyContext.Provider>
  );
};
