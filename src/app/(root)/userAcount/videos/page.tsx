import React from 'react'
import UserVideos from '@/components/userAcount/userVideos'
import Userprofile from '@/components/userAcount/userprofile'
function page() {
  return (
    <div>
      <Userprofile/>
        <UserVideos/>
    </div>
  )
}

export default page