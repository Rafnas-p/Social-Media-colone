'use client';
import React, { Suspense } from 'react';
import Userprofile from '@/components/userAcount/userprofile';
import UserShorts from '@/components/userAcount/userShoerts';

function Page() {
  return (
    <div>
     
      <Suspense fallback={<div>Loading User Shorts...</div>}>
      <Userprofile />
        <UserShorts />
      </Suspense>
    </div>
  );
}

export default Page;
