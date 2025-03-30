
import React from 'react';
import { useFlowState } from './hooks/useFlowState';
import { useFlowHandlers } from './hooks/useFlowHandlers';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from './layout/MobileLayout';
import DesktopLayout from './layout/DesktopLayout';
import FlowContentInitializer from './flow-layout/FlowContentInitializer';

interface StrategyFlowContentProps {
  onReady?: () => void;
}

const StrategyFlowContent: React.FC<StrategyFlowContentProps> = ({ onReady }) => {
  // Get all flow state from a custom hook
  const flowState = useFlowState();
  const isMobile = useIsMobile();
  
  // Get all flow handlers from a custom hook
  const flowHandlers = useFlowHandlers(flowState);
  
  return (
    <FlowContentInitializer 
      flowState={flowState} 
      flowHandlers={flowHandlers}
      onReady={onReady}
    >
      {({ canvasProps, sidebarVisible, toggleSidebar }) => 
        isMobile ? (
          <MobileLayout
            canvasProps={canvasProps}
            flowState={flowState}
            flowHandlers={flowHandlers}
            sidebarVisible={sidebarVisible}
            toggleSidebar={toggleSidebar}
          />
        ) : (
          <DesktopLayout
            canvasProps={canvasProps}
            flowState={flowState}
            flowHandlers={flowHandlers}
            sidebarVisible={sidebarVisible}
            toggleSidebar={toggleSidebar}
          />
        )
      }
    </FlowContentInitializer>
  );
};

export default StrategyFlowContent;
