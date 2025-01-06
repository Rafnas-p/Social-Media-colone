"use client";
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { UserAuth } from "@/context/authcontext/authcontext";
import { Key } from 'readline';

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
    createdAt: string; 
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
  };
}
interface User {
  _id?: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export type Channel = {
  _id: string;
  handle: string;
  name: string;
  profile: string;
  subscribers: string[];
  totalSubscribers: number;
  userId: string;
  __v: number;
};




interface Video {
  _id: string;                     
  videoUrl: string;                 
  title: string;                    
  description: string;              
  visibility: string;                
  restrictions: string;             
  createdAt: string;                
  views: number;                     
  comments: number;                 
  likes: string[];                 
  dislikes: string[];               
  publicId: string;                
  userId: string;                   
  videoId: string;                  
  kind: string;                     
  etag: string;                     
  id: {
    kind: string;
    videoId: string;
  };                                
}


interface MyProviderProps {
  children: ReactNode;
}
type SearchItem = {
  createdAt(createdAt: any): React.ReactNode;
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



interface MyContextType {
  selectedcat: string;
  setselectedcat: (newValue: string) => void;
  data: Video[];
  comments?: Comment[];
  fetchComments?: (videoId: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  searchData?: SearchDataItem[];
  loading: boolean;
   

  error: string | null;
  filteredData: SearchItem[];
  setFilteredData: (data: SearchItem[]) => void;
  userVideos: Video[] | undefined;
  shorts: Video[];
  channels: Channel | null ; 
  isSignedIn: boolean;
  user: User | null;
}

export const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [selectedcat, setselectedcat] = useState<string>("New");
  const [data, setData] = useState<Video[]>([]);
 
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  
  const [filteredData, setFilteredData] = useState<SearchItem[]>([]);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [shorts, setShorts] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel | null>(null);
  
    const { user } = UserAuth() as { user: User | null };


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    
  };

   useEffect(() => {
      setTimeout(() => {
        setIsSignedIn(!!user); 
        setLoading(false); 
      }, 2000); 
    }, [user]);

    console.log('isSignedIn',isSignedIn);
    
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/EntairVideos");
  
        if (response.data && response.data.videos) {
          setData(response.data.videos);
        } else {
          console.error("Invalid API response format");
        }
        setLoading(false);
      } catch (err:any| unknown) {
        console.error("Error fetching videos:", err.message);
        setError(err.message || "Failed to fetch videos");
        setLoading(false);
      }
    };
  
    fetchAllVideos();
  }, []);

console.log('UUser',user);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/getchannel",
          {
            params: { ownerId: user?._id },
          }
        );
        setChannels(response.data);
      } catch (err: any|unknown) {
        setError(err.response?.data?.message || "Failed to fetch channels.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchChannels();
    }
  }, [user?.uid]);



  useEffect(() => {
    const fetchVideosById = async () => {
      try {
        if (!user?._id) return;
        const response = await axios.get("http://localhost:5000/api/videos", {
          params: { userId: user._id },
        });

        setUserVideos(response.data.videos);
      } catch (err: any| unknown) {
        setError(err.message || "Failed to fetch videos.");
      }
    };

    fetchVideosById();
  }, [user?._id,]);

  useEffect(() => {
    const fetchShorts = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/shorts", {
          params: { userId: user._id },
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
  }, [user?._id]);



  

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
       user,
       isSignedIn
    }}>
      {children}
    </MyContext.Provider>
  );
};
