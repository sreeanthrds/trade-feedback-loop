
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TopToolbar from '../toolbars/TopToolbar';
import BottomToolbar from '../toolbars/BottomToolbar';
import ReactFlowCanvas from '../canvas/ReactFlowCanvas';
import NodePanel from '../NodePanel';
import NodeSidebar from '../NodeSidebar';
import { Node } from '@xyflow/react';

interface MobileLayoutProps {
  canvasProps: any;
  flowState: {
    isPanelOpen: boolean;
    selectedNode: Node | null;
    setIsPanelOpen: (isOpen: boolean) => void;
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

const MobileLayout: React.FC<MobileLayoutProps> = ({
  canvasProps,
  flowState,
  flowHandlers,
  sidebarVisible,
  toggleSidebar
}) => {
  return (
    <div className="h-full w-full relative">
      <TopToolbar 
        onReset={flowHandlers.resetStrategy} 
        onImportSuccess={flowHandlers.handleImportSuccess} 
      />
      
      <ReactFlowCanvas {...canvasProps} />
      
      <Sheet 
        open={flowState.isPanelOpen} 
        onOpenChange={flowState.setIsPanelOpen}
      >
        <SheetContent side="bottom" className="h-[85vh] py-0 px-0">
          {flowState.selectedNode && (
            <NodePanel 
              node={flowState.selectedNode} 
              updateNodeData={flowHandlers.updateNodeData} 
              onClose={flowHandlers.closePanel} 
            />
          )}
        </SheetContent>
      </Sheet>
      
      <BottomToolbar />

      {/* Node sidebar drawer for mobile */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 w-10 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {sidebarVisible ? 
            <ChevronLeft className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
        </Button>
      </div>
      
      <div 
        className={`
          absolute left-0 top-0 h-full bg-background 
          border-r border-border transition-all duration-300 z-10 
          ${sidebarVisible ? 'w-[70px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}
        `}
      >
        <NodeSidebar onAddNode={flowHandlers.handleAddNode} />
      </div>
    </div>
  );
};

export default MobileLayout;
