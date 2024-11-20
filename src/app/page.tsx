// src/app/page.js
import React from 'react';
import { MyProvider } from '@/context/vidoContext/VideoContext';
import DisplayData from '@/components/videoplayer/home';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';
import { AuthContextProvider } from '@/context/authcontext/authcontext';

export default function Page() {
  return (
    <MyProvider> 
      <AuthContextProvider>
      <>
         
         <Navbar/>
        <Sidebar/>
        <DisplayData/>
        </>
      </AuthContextProvider>
       
    </MyProvider>
  );
}
