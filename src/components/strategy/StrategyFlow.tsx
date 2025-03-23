
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import StrategyFlowContent from './StrategyFlowContent';
import '@xyflow/react/dist/style.css';
import './StrategyFlow.css';

const StrategyFlow = () => {
  return (
    <ReactFlowProvider>
      <StrategyFlowContent />
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
