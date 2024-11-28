import React, { ReactNode } from 'react';
import Navbar2 from '@/components/channal/navbar';
import Sidbar2 from '@/components/channal/sidbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar2 />
      <Sidbar2 />
      <main>{children}</main>
    </>
  );
};

export default Layout;
