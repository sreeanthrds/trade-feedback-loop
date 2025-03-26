
import React, { Suspense, lazy } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './styles/index.css';
import './styles/mobile-fixes.css';
import './styles/menus.css';

// Use lazy loading for StrategyFlowContent
const StrategyFlowContent = lazy(() => 
  import('./StrategyFlowContent').then(module => ({
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

const StrategyFlow = () => {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<LoadingFallback />}>
        <StrategyFlowContent />
      </Suspense>
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
