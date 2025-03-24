
import React from 'react';
import SplitPane from 'react-split-pane';
import NodeSidebar from '../NodeSidebar';
import { Node } from '@xyflow/react';
import './SplitPaneStyles.css';

interface FlowLayoutProps {
  children: React.ReactNode;
  isPanelOpen: boolean;
  selectedNode: Node | null;
  onAddNode: (type: string) => void;
  updateNodeData: (id: string, data: any) => void;
  onClosePanel: () => void;
  nodePanelComponent?: React.ReactNode;
}

// Define a more specific type for SplitPane that includes children
// This helps TypeScript understand that children is a valid prop
interface SplitPaneProps {
  split: 'vertical' | 'horizontal';
  minSize?: number;
  maxSize?: number;
  defaultSize?: number | string;
  size?: number | string;
  onChange?: (size: number) => void;
  onDragStarted?: () => void;
  onDragFinished?: (size: number) => void;
  allowResize?: boolean;
  primary?: 'first' | 'second';
  paneStyle?: React.CSSProperties;
  pane1Style?: React.CSSProperties;
  pane2Style?: React.CSSProperties;
  resizerStyle?: React.CSSProperties;
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
  // Calculate default size for the node panel (bottom panel)
  const defaultBottomPanelSize = isPanelOpen ? 300 : 0;

  // Use our custom typed SplitPane component
  return (
    <div className="strategy-flow-container h-full">
      {/* Horizontal split for sidebar and main content */}
      <SplitPane
        split="vertical"
        minSize={200}
        defaultSize={200}
        primary="first"
        paneStyle={{ overflow: 'auto' }}
      >
        {/* Left sidebar */}
        <div className="bg-secondary/30 h-full overflow-y-auto">
          <NodeSidebar onAddNode={onAddNode} />
        </div>

        {/* Main content and bottom panel */}
        {isPanelOpen && selectedNode ? (
          <SplitPane
            split="horizontal"
            primary="second"
            minSize={200}
            maxSize={500}
            defaultSize={defaultBottomPanelSize}
            paneStyle={{ overflow: 'auto' }}
          >
            <div className="h-full">{children}</div>
            <div className="overflow-y-auto border-t border-border">
              {nodePanelComponent}
            </div>
          </SplitPane>
        ) : (
          <div className="h-full">{children}</div>
        )}
      </SplitPane>
    </div>
  );
};

export default FlowLayout;
