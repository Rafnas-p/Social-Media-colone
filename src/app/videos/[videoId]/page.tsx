import React from 'react'
import VideoPlayer from "../../../components/videoplayer/videoPlayer"
import { MyProvider } from '@/context/vidoContext/VideoContext';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';

function Page() {
  return (
    <MyProvider>
  <div
    ><Navbar/>
    <Sidebar/>
      <VideoPlayer/></div>
    </MyProvider>
  
  )
}

export default Page