'use client';
import React, { Suspense } from 'react';
import Userprofile from '@/components/userAcount/userprofile';
import UserShorts from '@/components/userAcount/userShoerts';

function Page() {
  return (
    <div>
      <Userprofile />
      <Suspense fallback={<div>Loading User Shorts...</div>}>
        <UserShorts />
      </Suspense>
    </div>
  );
}

export default Page;
