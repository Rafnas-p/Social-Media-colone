// src/app/page.js
import React from 'react';
import { MyProvider } from '@/components/vidoContext/VideoContext';
import DisplayData from '@/components/vidoplayer/home';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';


export default function Page() {
  return (
    <MyProvider> 
      
        <>
         
         <Navbar/>
        <Sidebar/>
        <DisplayData/>
        </>
    </MyProvider>
  );
}
