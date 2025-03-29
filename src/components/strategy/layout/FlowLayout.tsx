import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NodeSidebar } from '../NodeSidebar';
import { usePanelState } from '@/hooks/use-panel-state';
import { useFlowHandlers } from '@/hooks/useFlowHandlers';
import './FlowLayout.css';

const FlowLayout = ({ children }: { children: React.ReactNode }) => {
  const { isPanelOpen, selectedNode } = usePanelState();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const { handleAddNode } = useFlowHandlers();

  return (
    <div className="flow-layout">
      <div className="flow-layout-sidebar">
        <div
          className={`flow-layout-sidebar-inner ${menuCollapsed ? 'collapsed' : ''}`}
          data-collapsed={menuCollapsed}
        >
          <button
            className="sidebar-collapse-button"
            onClick={() => setMenuCollapsed(!menuCollapsed)}
            aria-label={menuCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {menuCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          <NodeSidebar 
            onAddNode={(type, parentNodeId, initialNodeData) => 
              handleAddNode(type, parentNodeId, initialNodeData)
            } 
          />
        </div>
      </div>
      <div className="flow-layout-content">
        {children}
        {isPanelOpen && selectedNode && (
          <div className="flow-layout-panel">
            {/* The NodePanel component will be rendered here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowLayout;
