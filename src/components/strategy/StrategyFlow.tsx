
import React, { Suspense, lazy } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import './styles/index.css';
import './styles/mobile-fixes.css';
import StrategyFlowContent from './StrategyFlowContent';

const StrategyFlow = () => {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading strategy builder...</div>}>
        <StrategyFlowContent />
      </Suspense>
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
