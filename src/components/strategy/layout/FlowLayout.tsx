
import React from 'react';
import { Node } from '@xyflow/react';
import NodeSidebar from '../NodeSidebar';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import './FlowLayout.css';

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
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={10} minSize={8} maxSize={15} className="bg-secondary/30">
          <NodeSidebar onAddNode={onAddNode} />
        </ResizablePanel>
        
        {isPanelOpen && selectedNode ? (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={30}>
              {children}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="border-l border-border">
              {nodePanelComponent}
            </ResizablePanel>
          </>
        ) : (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={90} className="flow-main-content">
              {children}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default FlowLayout;
