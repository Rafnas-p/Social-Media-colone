import React from 'react'
import SearchPlyer from '@/components/navbar/searchPlyer'
import Navbar from '@/components/navbar/navbar'
import Sidebar from '@/components/sidebar/sidebar'
import { MyProvider } from '@/context/vidoContext/VideoContext'
function Page() {
  console.log('hudshuhudfdnjsdnj');

  
  return (
    <div>
      
        <MyProvider>
        <Navbar/>
        <Sidebar/>
    
       
        <SearchPlyer/>
        </MyProvider>

    </div>
  )
}

export default Page