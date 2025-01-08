import React from 'react'
import { Suspense } from 'react'
import UserVideos from '@/components/userAcount/userVideos'
import Userprofile from '@/components/userAcount/userprofile'
function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading User Shorts...</div>}>

      <Userprofile/>
        <UserVideos/>
        </Suspense>
    </div>
  )
}

export default page