
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();

  // Auto-expand on mobile for better experience
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(true);
    }
    
    // Mark as loaded after a short delay to improve perceived performance
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isMobile]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="h-full">
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
          {isLoaded ? <StrategyFlow /> : <LoadingPlaceholder />}
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
