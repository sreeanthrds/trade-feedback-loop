
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StrategyFlow from '@/components/strategy/StrategyFlow';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const strategyName = searchParams.get('name') || 'Untitled Strategy';
  
  // Mark as loaded after a short delay to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Initialize strategy with name
    console.log(`Strategy initialized with name: ${strategyName}`);
    
    return () => clearTimeout(timer);
  }, [strategyName]);

  return (
    <div className="h-[calc(100vh-4px)] w-full relative">
      {/* Back button */}
      <div className="absolute top-1 left-16 z-10">
        <Link to="/app">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Strategies
          </Button>
        </Link>
      </div>
      
      {/* Strategy name indicator */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-sm font-medium">
          {strategyName}
        </div>
      </div>
      
      <div className="w-full h-full flex-1 flex flex-col p-0">
        <div className="h-full w-full overflow-hidden rounded-none border-none">
          {isLoaded ? <StrategyFlow /> : <LoadingPlaceholder />}
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
