
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import StrategyFlowContent from './StrategyFlowContent';
// Explicitly import both the React Flow styles and our custom styles
import '@xyflow/react/dist/style.css';
import './styles/index.css';

const StrategyFlow = () => {
  console.log('Rendering StrategyFlow component');
  
  return (
    <ReactFlowProvider>
      <StrategyFlowContent />
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
