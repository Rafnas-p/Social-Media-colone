import React from 'react'
import Userprofile from '@/components/userAcount/userprofile'
import Navbar from '@/components/navbar/navbar'
import Sidebar from '@/components/sidebar/sidebar'
import { MyProvider } from '@/context/vidoContext/VideoContext'
function Page() {
  return (
    <div>
        <MyProvider>
        <Navbar/>
       <Sidebar/>
        <Userprofile/>
        </MyProvider>
       
    </div>
  )
}

export default Page