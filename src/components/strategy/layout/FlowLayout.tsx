
import React from 'react';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import NodeSidebar from '../NodeSidebar';
import './FlowLayout.css';

interface FlowLayoutProps {
  children: React.ReactNode;
  isPanelOpen: boolean;
  selectedNode: any;
  onClosePanel: () => void;
  nodePanelComponent: React.ReactNode;
}

const FlowLayout: React.FC<FlowLayoutProps> = ({
  children,
  isPanelOpen,
  selectedNode,
  onClosePanel,
  nodePanelComponent
}) => {
  return (
    <div className={`w-full h-full overflow-hidden strategy-flow-layout ${isPanelOpen ? 'panel-open' : ''}`}>
      {isPanelOpen ? (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={75} minSize={50} id="flow-panel" order={1}>
            {children}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} minSize={15} id="details-panel" order={2}>
            {nodePanelComponent}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={15} minSize={10} id="sidebar-panel" order={1} className="nodrag">
            <NodeSidebar onAddNode={(type) => {}} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={85} id="flow-panel" order={2}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default FlowLayout;
