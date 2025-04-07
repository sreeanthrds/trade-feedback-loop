
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
