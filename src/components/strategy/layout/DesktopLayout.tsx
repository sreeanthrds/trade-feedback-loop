
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TopToolbar from '../toolbars/TopToolbar';
import BottomToolbar from '../toolbars/BottomToolbar';
import ReactFlowCanvas from '../canvas/ReactFlowCanvas';
import NodePanel from '../NodePanel';
import NodeSidebar from '../NodeSidebar';
import { Node } from '@xyflow/react';

interface DesktopLayoutProps {
  canvasProps: any;
  flowState: {
    isPanelOpen: boolean;
    selectedNode: Node | null;
  };
  flowHandlers: {
    closePanel: () => void;
    updateNodeData: (id: string, data: any) => void;
    resetStrategy: () => void;
    handleImportSuccess: () => void;
    handleAddNode: (type: string, parentNodeId?: string) => void;
  };
  sidebarVisible: boolean;
  toggleSidebar: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  canvasProps,
  flowState,
  flowHandlers,
  sidebarVisible,
  toggleSidebar
}) => {
  return (
    <div className="h-full w-full relative">
      <div className="flex flex-col h-full">
        <TopToolbar 
          onReset={flowHandlers.resetStrategy} 
          onImportSuccess={flowHandlers.handleImportSuccess} 
        />
        
        <div className="flex-grow relative flex">
          {/* Collapsible node sidebar */}
          <div 
            className={`
              bg-background border-r border-border 
              transition-all duration-300 
              ${sidebarVisible ? 'w-[70px]' : 'w-0 overflow-hidden'}
            `}
          >
            <NodeSidebar onAddNode={flowHandlers.handleAddNode} />
          </div>
          
          {/* Main canvas area */}
          <div className="flex-grow relative">
            <ReactFlowCanvas {...canvasProps} />

            {/* Sidebar toggle button */}
            <div className="absolute left-4 top-4 z-10">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 rounded-full shadow-md"
                onClick={toggleSidebar}
              >
                {sidebarVisible ? 
                  <ChevronLeft className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </Button>
            </div>
          </div>
          
          {/* Node configuration panel */}
          <div 
            className={`
              bg-background border-l border-border 
              transition-all duration-300 
              ${flowState.isPanelOpen ? 'w-[420px]' : 'w-0 overflow-hidden'}
            `}
          >
            {flowState.isPanelOpen && flowState.selectedNode && (
              <NodePanel 
                node={flowState.selectedNode} 
                updateNodeData={flowHandlers.updateNodeData} 
                onClose={flowHandlers.closePanel}
              />
            )}
          </div>
        </div>
        
        <BottomToolbar />
      </div>
    </div>
  );
};

export default DesktopLayout;
