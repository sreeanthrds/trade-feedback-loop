
import React, { Suspense } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './styles/index.css';
import './styles/mobile-fixes.css';
import './styles/menus.css';
import StrategyFlowContent from './StrategyFlowContent';
import VisualPositionStore from './vps/VisualPositionStore';
import FloatingVpsButton from './vps/FloatingVpsButton';

interface StrategyFlowProps {
  isNew?: boolean;
}

const LoadingIndicator = () => (
  <div className="h-full w-full flex items-center justify-center bg-background/50">
    <div className="flex flex-col items-center">
      <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
      <p className="text-sm text-muted-foreground">Loading strategy builder...</p>
    </div>
  </div>
);

const StrategyFlow = ({ isNew = false }: StrategyFlowProps) => {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<LoadingIndicator />}>
        <StrategyFlowContent isNew={isNew} />
        <FloatingVpsButton />
        <VisualPositionStore />
      </Suspense>
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
