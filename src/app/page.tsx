import React from 'react';
import DisplayData from '@/components/videoplayer/home';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';
import DisplayShortsGrid from '@/components/videoplayer/shorts';

export default function Page() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="mt-5 px-4">
          <DisplayData />

          <DisplayShortsGrid />
        </div>
      </div>
    </div>
  );
}
