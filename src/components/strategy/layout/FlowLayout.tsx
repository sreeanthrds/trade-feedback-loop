
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

// This interface helps TypeScript understand the props for SplitPane
interface SplitPaneComponentProps {
  split?: 'vertical' | 'horizontal';
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
  size?: number;
  primary?: 'first' | 'second';
  paneStyle?: React.CSSProperties;
  pane1Style?: React.CSSProperties;
  pane2Style?: React.CSSProperties;
  resizerStyle?: React.CSSProperties;
  onChange?: (size: number) => void;
  onDragStarted?: () => void;
  onDragFinished?: () => void;
  allowResize?: boolean;
  children: React.ReactNode;
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
      <SplitPane 
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
          <SplitPane
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
          </SplitPane>
        ) : (
          <div className="flow-main-content">
            {children}
          </div>
        )}
      </SplitPane>
    </div>
  );
};

export default FlowLayout;
