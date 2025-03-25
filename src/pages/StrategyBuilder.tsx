
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
      {!isExpanded && <Navbar />}
      <main className={`flex-grow ${isExpanded ? 'h-screen w-screen p-0 flex flex-col' : 'pt-16 md:pt-20'}`}>
        <div className={`transition-all duration-300 ${isExpanded ? 'w-full h-full flex-1 flex flex-col p-0' : 'container max-w-7xl mx-auto px-4 py-6'}`}>
          <div className={`${isExpanded ? 'absolute top-4 right-4 z-10' : 'mb-6 pt-4 flex justify-between items-center'}`}>
            {!isExpanded && (
              <div>
                <h1 className="text-3xl font-bold mb-2">Strategy Builder</h1>
                <p className="text-foreground/70">
                  Build complex trading strategies with our no-code node-based visual editor
                </p>
              </div>
            )}
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
