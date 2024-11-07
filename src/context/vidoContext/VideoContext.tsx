"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { fetchDataFromApi } from '../../components/utils/youtubeApi';

interface VideoSnippet {
  title: string;
  description: string;
  // Define other fields of the snippet as per your response data structure
}

interface ApiResponse {
  items: Array<{ id: { videoId: string }; snippet: VideoSnippet }>;
  // Add other fields based on actual response if necessary
}

interface MyContextType {
  selectedcat: string;
  setselectedcat: (newValue: string) => void;
  data: ApiResponse | null;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const MyContext = createContext<MyContextType | undefined>(undefined);

interface MyProviderProps {
  children: ReactNode;
}

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [selectedcat, setselectedcat] = useState<string>("New");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await fetchDataFromApi('search', {
          q: selectedcat,
          part: 'snippet',
          type: 'video',
          maxResults: 10,
        });
        
        // Type-casting the response to match the expected ApiResponse type
        setData(response as ApiResponse); // Type-casting here

        console.log('Fetched data:', response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedcat]);

  return (
    <MyContext.Provider value={{ selectedcat, setselectedcat, data, isOpen, toggleSidebar }}>
      {children}
    </MyContext.Provider>
  );
};
