
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import StrategyFlowContent from './StrategyFlowContent';
import '@xyflow/react/dist/style.css';
import './styles/index.css'; // Updated CSS import
import 'react-split-pane/dist/react-split-pane.css'; // Import react-split-pane CSS

const StrategyFlow = () => {
  return (
    <ReactFlowProvider>
      <StrategyFlowContent />
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
