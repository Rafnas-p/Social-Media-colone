
// "use client";
// import React, { useState } from 'react';
// import Navbar from './navbar';
// import Sidebar from '../sidebar/sidebar';
// import  DisplayData from '../vidoplayer/home'
// interface LayoutProps{
//     children: React.ReactNode
// }

// const Layout:React.FC<LayoutProps> = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(prevState => !prevState);
//   };

//   return (
//     <div className="flex">
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="flex-grow">
//         <Navbar toggleSidebar={toggleSidebar} />
//         <main className="p-4">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
