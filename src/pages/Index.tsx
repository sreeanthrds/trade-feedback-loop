
import React, { useEffect } from 'react';
import Hero from '@/components/home/hero';
import Benefits from '@/components/home/benefits';
import Testimonials from '@/components/home/testimonials';
import Pricing from '@/components/home/pricing';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

const Index = () => {
  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
    
    // Log that home page is loading
    console.log('Home page mounted');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Benefits />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
