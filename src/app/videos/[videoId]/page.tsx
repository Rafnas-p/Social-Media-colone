import React from 'react'
import VideoPlayer from "../../../components/vidoplayer/videoPlayer"
import { MyProvider } from '@/components/vidoContext/VideoContext';
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