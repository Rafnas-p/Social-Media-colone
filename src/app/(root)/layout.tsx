import React, { ReactNode } from 'react';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar/>
      <Sidebar/>
      <main>{children}</main>
    </>
  );
};

export default Layout;