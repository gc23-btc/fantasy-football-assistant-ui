import React from 'react';
import { Header } from './Header';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="py-4 px-4">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
