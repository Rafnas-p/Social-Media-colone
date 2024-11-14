import Signup from '@/components/sign-up/signup'
import React from 'react'
import { AuthContextProvider } from '@/context/authcontext/authcontext'
function Page() {
  return (
    <div>
    <AuthContextProvider>
    <Signup/>
    </AuthContextProvider>

       
    </div>
  )
}

export default Page