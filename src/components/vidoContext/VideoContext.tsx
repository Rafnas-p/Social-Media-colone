"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { fetchDataFromApi } from '../utils/youtubeApi';

interface MyContextType {
  selectedcat: string; 
  setselectedcat: (newValue: string) => void;
  data: any[]; 
}

export const MyContext = createContext<MyContextType | undefined>(undefined);

interface MyProviderProps {
  children: ReactNode;
}

export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [selectedcat, setselectedcat] = useState<string>("New");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromApi(`search`, {
          q: selectedcat,
          part: 'snippet',
          type: 'video',
          maxResults: 10
        });
        setData(response); 
        console.log('Fetched data:', response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedcat]);

  return (
    <MyContext.Provider value={{ selectedcat, setselectedcat, data }}>
      {children}
    </MyContext.Provider>
  );
};

