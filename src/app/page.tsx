// src/app/page.js
import React from 'react';
import Layout from '@/components/navbar/layout';
import { MyProvider } from '@/components/vidoContext/VideoContext';

export default function Page() {
  return (
    <MyProvider> {/* Wrap your layout with the context provider */}
      <Layout>
        <>
          {/* Add any additional components or content here */}
        </>
      </Layout>
    </MyProvider>
  );
}
