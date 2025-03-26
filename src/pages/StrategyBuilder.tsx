
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the StrategyFlow component for better initial page load
const StrategyFlow = lazy(() => 
  import('@/components/strategy/StrategyFlow').then(module => ({
    default: module.default
  }))
);

// Loading fallback optimized for better perceived performance
const LoadingFallback = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Loading strategy builder...</p>
    </div>
  </div>
);

const StrategyBuilder = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  // Auto-expand on mobile for better experience
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(true);
    }
  }, [isMobile]);

  // Memoize toggle function to prevent unnecessary re-renders
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

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
            <Suspense fallback={<LoadingFallback />}>
              <StrategyFlow />
            </Suspense>
          </div>
        </div>
      </main>
      {!isExpanded && <Footer />}
    </div>
  );
};

export default StrategyBuilder;
