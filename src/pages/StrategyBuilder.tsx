
import React, { useState } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import StrategyFlow from '@/components/strategy/StrategyFlow';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

const StrategyBuilder = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow pt-16 md:pt-20 ${isExpanded ? 'flex-1 flex flex-col' : ''}`}>
        <div className={`mx-auto px-4 py-6 transition-all duration-300 ${isExpanded ? 'w-full h-full flex-1 flex flex-col' : 'container max-w-7xl'}`}>
          <div className="mb-6 pt-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Strategy Builder</h1>
              <p className="text-foreground/70">
                Build complex trading strategies with our no-code node-based visual editor
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={toggleExpand}
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Compact View</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Expand</span>
                </>
              )}
            </Button>
          </div>
          
          <div className={`border border-border overflow-hidden rounded-xl ${isExpanded ? 'flex-1' : 'h-[calc(100vh-250px)] min-h-[650px]'}`}>
            <StrategyFlow />
          </div>
        </div>
      </main>
      {!isExpanded && <Footer />}
    </div>
  );
};

export default StrategyBuilder;
