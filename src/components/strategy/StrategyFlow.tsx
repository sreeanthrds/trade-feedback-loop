
import React, { Suspense, useState, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './styles/index.css';
import './styles/mobile-fixes.css';
import './styles/menus.css';
import StrategyFlowContent from './StrategyFlowContent';

const StrategyFlow = () => {
  // Using a local state variable to track the loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Set up handler to mark loading as complete with useCallback for stability
  const handleReady = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <ReactFlowProvider>
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading strategy builder...</div>}>
        {isLoading && (
          <div className="h-full w-full flex items-center justify-center">
            Initializing flow editor...
          </div>
        )}
        <div className={isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 transition-opacity duration-300 h-full'}>
          <StrategyFlowContent onReady={handleReady} />
        </div>
      </Suspense>
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
