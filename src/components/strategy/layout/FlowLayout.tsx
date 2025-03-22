
import React from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import NodePanel from '../NodePanel';
import { Node } from '@xyflow/react';

interface FlowLayoutProps {
  children: React.ReactNode;
  isPanelOpen: boolean;
  selectedNode: Node | null;
  updateNodeData: (id: string, data: any) => void;
  onClosePanel: () => void;
}

const FlowLayout: React.FC<FlowLayoutProps> = ({
  children,
  isPanelOpen,
  selectedNode,
  updateNodeData,
  onClosePanel
}) => {
  return (
    <div className="strategy-flow-container h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={isPanelOpen ? 80 : 100}>
          {children}
        </ResizablePanel>
        
        {isPanelOpen && selectedNode && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20} minSize={20} maxSize={35}>
              <NodePanel 
                node={selectedNode} 
                updateNodeData={updateNodeData} 
                onClose={onClosePanel} 
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default FlowLayout;
