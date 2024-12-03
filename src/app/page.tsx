// src/app/page.js
import React from 'react';
import DisplayData from '@/components/videoplayer/home';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';
export default function Page() {
  return (
    
      <>
      <Navbar/>
      <Sidebar/>
      <DisplayData/>
     
        </>
      
  );
}
