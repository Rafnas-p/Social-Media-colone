import React, { ReactNode } from 'react';
import { MyProvider } from './vidoContext/VideoContext';

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  return (
    <MyProvider>
      <div>
        {children}
      </div>
    </MyProvider>
  );
};

export default ContextProvider;


