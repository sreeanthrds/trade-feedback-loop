
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import StrategyFlow from '@/components/strategy/StrategyFlow';
import { ReactFlowProvider } from '@xyflow/react';

const StrategyBuilder = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 pt-4">
            <h1 className="text-3xl font-bold mb-2">Strategy Builder</h1>
            <p className="text-foreground/70">
              Build complex trading strategies with our node-based visual editor
            </p>
          </div>
          
          <div className="h-[calc(100vh-250px)] min-h-[600px] rounded-xl border border-border overflow-hidden">
            <ReactFlowProvider>
              <StrategyFlow />
            </ReactFlowProvider>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StrategyBuilder;
