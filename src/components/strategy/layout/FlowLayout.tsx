
import React from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import NodeSidebar from '../NodeSidebar';
import { Node } from '@xyflow/react';

interface FlowLayoutProps {
  children: React.ReactNode;
  isPanelOpen: boolean;
  selectedNode: Node | null;
  onAddNode: (type: string) => void;
  updateNodeData: (id: string, data: any) => void;
  onClosePanel: () => void;
  nodePanelComponent?: React.ReactNode;
}

const FlowLayout: React.FC<FlowLayoutProps> = ({
  children,
  isPanelOpen,
  selectedNode,
  onAddNode,
  onClosePanel,
  nodePanelComponent
}) => {
  return (
    <div className="strategy-flow-container h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Fixed width node sidebar without a resize handle */}
        <ResizablePanel 
          defaultSize={6} 
          minSize={6} 
          maxSize={6} 
          className="bg-secondary/30"
        >
          <NodeSidebar onAddNode={onAddNode} />
        </ResizablePanel>
        
        {/* Main content panel */}
        <ResizablePanel defaultSize={94} minSize={60}>
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel 
              defaultSize={isPanelOpen ? 70 : 100} 
              minSize={isPanelOpen ? 40 : 100}
            >
              {children}
            </ResizablePanel>
            
            {/* Config panel with resize handle */}
            {isPanelOpen && selectedNode && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel 
                  defaultSize={30} 
                  minSize={15} 
                  maxSize={55} 
                  className="overflow-y-auto border-t border-border"
                >
                  {nodePanelComponent}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default FlowLayout;
