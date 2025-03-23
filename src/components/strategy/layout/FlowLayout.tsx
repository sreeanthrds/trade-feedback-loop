
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
  updateNodeData,
  onClosePanel,
  nodePanelComponent
}) => {
  return (
    <div className="strategy-flow-container h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Fixed width node sidebar without a resize handle */}
        <ResizablePanel defaultSize={6} minSize={6} maxSize={6} className="bg-secondary/30">
          <NodeSidebar onAddNode={onAddNode} />
        </ResizablePanel>
        
        <ResizablePanel defaultSize={isPanelOpen ? 65 : 94} minSize={isPanelOpen ? 45 : 85}>
          {children}
        </ResizablePanel>
        
        {isPanelOpen && selectedNode && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={29} minSize={20} maxSize={45}>
              {nodePanelComponent}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default FlowLayout;
