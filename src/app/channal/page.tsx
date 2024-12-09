
import React from 'react'
import Dashbord from '@/components/channal/dashbord'
import { MyProvider } from '@/context/vidoContext/VideoContext'
import Channalnav from '@/components/channal/channalnav'
function Page() {
  return (
    <div>
      <MyProvider>
        <Channalnav />
      <Dashbord/>

      </MyProvider>
    </div>
  )
}

export default Page