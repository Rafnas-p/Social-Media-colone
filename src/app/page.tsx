// src/app/page.js
import React from 'react';
import DisplayData from '@/components/videoplayer/home';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';
import DisplayShortsGrid from '@/components/videoplayer/shorts';
export default function Page() {
  return (
    
      <>
      <Navbar/>
      <Sidebar/>
      <DisplayData/>
     <DisplayShortsGrid/>
        </>
      
  );
}
