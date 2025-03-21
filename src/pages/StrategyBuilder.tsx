
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import StrategyFlow from '@/components/strategy/StrategyFlow';

const StrategyBuilder = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Strategy Builder</h1>
            <p className="text-foreground/70">
              Build complex trading strategies with our no-code node-based editor
            </p>
          </div>
          
          <div className="h-[calc(100vh-300px)] min-h-[600px] rounded-xl border border-border overflow-hidden">
            <StrategyFlow />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StrategyBuilder;
