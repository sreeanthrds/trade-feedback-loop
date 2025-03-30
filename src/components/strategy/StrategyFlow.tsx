
import React, { Suspense } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './styles/index.css';
import './styles/mobile-fixes.css';
import './styles/menus.css';

// Create a lazy-loaded version of StrategyFlowContent
const LazyStrategyFlowContent = React.lazy(() => import('./StrategyFlowContent'));

const StrategyFlow = () => {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading strategy builder...</div>}>
        <LazyStrategyFlowContent />
      </Suspense>
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
