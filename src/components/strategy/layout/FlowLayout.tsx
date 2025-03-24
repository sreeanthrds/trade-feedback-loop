
import React from 'react';
import SplitPane from 'react-split-pane';
import NodeSidebar from '../NodeSidebar';
import { Node } from '@xyflow/react';
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

// This is needed to properly type SplitPane from react-split-pane
const SplitPaneWrapper: typeof SplitPane = SplitPane as any;

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
      <SplitPaneWrapper 
        split="vertical"
        minSize={100}
        defaultSize={100}
        primary="first"
        paneStyle={{ overflow: 'auto' }}
        allowResize={false}
      >
        <div className="bg-secondary/30 h-full">
          <NodeSidebar onAddNode={onAddNode} />
        </div>
        
        {isPanelOpen && selectedNode ? (
          <SplitPaneWrapper
            split="horizontal"
            primary="second"
            minSize={200}
            maxSize={500}
            defaultSize={300}
            paneStyle={{ overflow: 'auto' }}
          >
            {children}
            <div className="border-t border-border overflow-y-auto">
              {nodePanelComponent}
            </div>
          </SplitPaneWrapper>
        ) : (
          <div className="flow-main-content">
            {children}
          </div>
        )}
      </SplitPaneWrapper>
    </div>
  );
};

export default FlowLayout;
