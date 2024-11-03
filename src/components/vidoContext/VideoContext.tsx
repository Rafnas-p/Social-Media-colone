"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { fetchDataFromApi } from '../utils/youtubeApi';


interface MyContextType {
    selectedcat: any[]; 
    setselectedcat: (newValue: any[]) => void
}


const MyContext = createContext<MyContextType | undefined>(undefined);

interface MyProviderProps {
  children: ReactNode; 
}


export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [selectedcat, setselectedcat] = useState<any>("New"); 

  
  useEffect(() => {
    fetchData(`search/?q=${selectedcat}`);
  }, [])

  
  const fetchData = async (url: string) => {
    try {
      const response = await fetchDataFromApi(url);
      console.log(response);
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <MyContext.Provider value={{ selectedcat, setselectedcat }}>
      {children}
    </MyContext.Provider>
  );
};


export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
