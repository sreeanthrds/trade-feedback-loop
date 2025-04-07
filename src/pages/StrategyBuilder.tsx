
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StrategyFlow from '@/components/strategy/StrategyFlow';

const LoadingPlaceholder = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/20">
    <div className="flex flex-col items-center">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium">Loading Strategy Builder...</p>
    </div>
  </div>
);

const StrategyBuilder = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Mark as loaded after a short delay to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-40px)]">
      <div className="w-full h-full flex-1 flex flex-col p-0">
        <div className="h-full w-full overflow-hidden rounded-none border-none">
          {isLoaded ? <StrategyFlow /> : <LoadingPlaceholder />}
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
