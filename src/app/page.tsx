// src/app/page.js
import React from 'react';
import Layout from '@/components/navbar/layout';
import { MyProvider } from '@/components/vidoContext/VideoContext';
import DisplayData from '@/components/vidoplayer/home';


export default function Page() {
  return (
    <MyProvider> {/* Wrap your layout with the context provider */}
      <Layout>
        <>
         <DisplayData/>
        </>
      </Layout>
    </MyProvider>
  );
}
