
import React from 'react';
import { usePanelState } from '../hooks/usePanelState';
import './FlowLayout.css';

interface FlowLayoutProps {
  children: React.ReactNode;
  nodePanelComponent?: React.ReactNode;
}

const FlowLayout = ({ 
  children,
  nodePanelComponent
}: FlowLayoutProps) => {
  const { isPanelOpen, selectedNode } = usePanelState();

  return (
    <div className="flow-layout">
      <div className="flow-layout-content">
        {children}
        {isPanelOpen && selectedNode && (
          <div className="flow-layout-panel">
            {nodePanelComponent}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowLayout;
