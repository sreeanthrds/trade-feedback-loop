
import React from 'react';
import { Node } from '@xyflow/react';
import { 
  ResizablePanelGroup, 
  ResizablePanel
} from '@/components/ui/resizable';
import './FlowLayout.css';

interface FlowLayoutProps {
  children: React.ReactNode;
  isPanelOpen: boolean;
  selectedNode: Node | null;
  onClosePanel: () => void;
  nodePanelComponent?: React.ReactNode;
}

const FlowLayout: React.FC<FlowLayoutProps> = ({
  children,
  isPanelOpen,
  selectedNode,
  onClosePanel,
  nodePanelComponent
}) => {
  return (
    <div className="strategy-flow-container h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {isPanelOpen && selectedNode ? (
          <>
            <ResizablePanel defaultSize={70} minSize={60}>
              {children}
            </ResizablePanel>
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="border-l border-border">
              {nodePanelComponent}
            </ResizablePanel>
          </>
        ) : (
          <ResizablePanel defaultSize={100} className="flow-main-content">
            {children}
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default FlowLayout;
