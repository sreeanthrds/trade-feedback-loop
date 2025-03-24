
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import StrategyFlowContent from './StrategyFlowContent';
import '@xyflow/react/dist/style.css';
import './styles/index.css'; // Updated CSS import

const StrategyFlow = () => {
  return (
    <ReactFlowProvider>
      <StrategyFlowContent />
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
