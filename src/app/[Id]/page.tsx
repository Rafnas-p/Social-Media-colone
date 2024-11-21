import React from 'react'
import SearchPlyer from '@/components/navbar/searchPlyer'
import Navbar from '@/components/navbar/navbar'
import { MyProvider } from '@/context/vidoContext/VideoContext'
import { AuthContextProvider } from '@/context/authcontext/authcontext'
import Sidebar from '@/components/sidebar/sidebar'
function Page() {
  

  
  return (
    <div>
      <AuthContextProvider>
        <MyProvider>
        <Navbar/>
        <Sidebar/>
    
       
        <SearchPlyer/>
        </MyProvider>
        </AuthContextProvider>

    </div>
  )
}

export default Page