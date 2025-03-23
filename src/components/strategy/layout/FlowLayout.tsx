
import React from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import NodeSidebar from '../NodeSidebar';
import NodePanel from '../NodePanel';
import { Node } from '@xyflow/react';

interface FlowLayoutProps {
  children: React.ReactNode;
  isPanelOpen: boolean;
  selectedNode: Node | null;
  onAddNode: (type: string) => void;
  updateNodeData: (id: string, data: any) => void;
  onClosePanel: () => void;
}

const FlowLayout: React.FC<FlowLayoutProps> = ({
  children,
  isPanelOpen,
  selectedNode,
  onAddNode,
  updateNodeData,
  onClosePanel
}) => {
  return (
    <div className="strategy-flow-container h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={15} minSize={12} maxSize={20} className="bg-secondary/30">
          <NodeSidebar onAddNode={onAddNode} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={isPanelOpen ? 65 : 85}>
          {children}
        </ResizablePanel>
        
        {isPanelOpen && selectedNode && (
          <ResizablePanel defaultSize={20} minSize={20} maxSize={35}>
            <NodePanel 
              node={selectedNode} 
              updateNodeData={updateNodeData} 
              onClose={onClosePanel} 
            />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default FlowLayout;
