"use client"
import React from 'react'
import { Suspense } from 'react';
import Userprofile from '@/components/userAcount/userprofile';
function Page() {
  return (
    <div>
      
     <Suspense fallback={<div>Loading User Shorts...</div>}>
       
        <Userprofile/>
       </Suspense>
       
    </div>
  )
}

export default Page