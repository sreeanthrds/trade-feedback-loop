
import React from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  NodeTypes,
  EdgeProps,
  Edge
} from '@xyflow/react';
import TopToolbar from './toolbars/TopToolbar';
import BottomToolbar from './toolbars/BottomToolbar';
import StartNode from './nodes/StartNode';
import SignalNode from './nodes/SignalNode';
import ActionNode from './nodes/ActionNode';
import EndNode from './nodes/EndNode';
import ForceEndNode from './nodes/ForceEndNode';
import NodeControls from './NodeControls';
import NodeConnectControls from './NodeConnectControls';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

// Custom edge with delete button
const ButtonEdge = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  source, 
  target,
  style,
  selected,
  animated,
  ...props 
}: EdgeProps & { id: string; onDelete: (id: string) => void }) => {
  const { onDelete } = props;
  
  return (
    <>
      {/* Draw a simple bezier edge */}
      <path
        id={id}
        className={`react-flow__edge-path ${animated ? 'animated' : ''}`}
        d={`M ${sourceX},${sourceY} C ${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`}
        style={style}
        strokeWidth={selected ? 3 : 2}
      />
      
      {/* Add a delete button with hover state */}
      <foreignObject
        width={20}
        height={20}
        x={(sourceX + targetX) / 2 - 10}
        y={(sourceY + targetY) / 2 - 10}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        className="edge-controls opacity-0 hover:opacity-100 transition-opacity duration-200"
      >
        <div className="flex items-center justify-center h-full">
          <Button
            variant="destructive"
            size="icon"
            className="h-5 w-5 rounded-full"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(id);
            }}
            title="Delete connection"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </foreignObject>
    </>
  );
};

interface ReactFlowCanvasProps {
  flowRef: React.RefObject<HTMLDivElement>;
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  toggleTheme: () => void;
  resetStrategy: () => void;
  onImportSuccess: () => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onAddNode: (type: string) => void;
}

// Create node types with delete functionality
const createNodeTypes = (onDeleteNode: (id: string) => void, onAddNode: (type: string) => void): NodeTypes => {
  return {
    startNode: (nodeProps) => (
      <div className="group">
        <StartNode {...nodeProps} />
        <NodeConnectControls showOn="start" onAddNode={onAddNode} />
      </div>
    ),
    signalNode: (nodeProps) => (
      <div className="group">
        <SignalNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
        <NodeConnectControls showOn="signal" onAddNode={onAddNode} />
      </div>
    ),
    actionNode: (nodeProps) => (
      <div className="group">
        <ActionNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
        <NodeConnectControls showOn="action" onAddNode={onAddNode} />
      </div>
    ),
    endNode: (nodeProps) => (
      <div className="group">
        <EndNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
      </div>
    ),
    forceEndNode: (nodeProps) => (
      <div className="group">
        <ForceEndNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
      </div>
    )
  };
};

const ReactFlowCanvas: React.FC<ReactFlowCanvasProps> = ({
  flowRef,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  toggleTheme,
  resetStrategy,
  onImportSuccess,
  onDeleteNode,
  onDeleteEdge,
  onAddNode
}) => {
  // Create memoized node types to prevent React Flow warnings
  const nodeTypes = React.useMemo(
    () => createNodeTypes(onDeleteNode, onAddNode),
    [onDeleteNode, onAddNode]
  );

  // Create edges with delete buttons
  const edgesWithDeleteButtons = edges.map((edge: Edge) => ({
    ...edge,
    data: {
      ...edge.data,
      onDelete: onDeleteEdge
    }
  }));

  // Memoize the edge types to prevent React Flow warnings
  const edgeTypes = React.useMemo(
    () => ({
      default: (props: any) => <ButtonEdge {...props} onDelete={onDeleteEdge} />
    }),
    [onDeleteEdge]
  );

  return (
    <div className="h-full w-full" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edgesWithDeleteButtons}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        deleteKeyCode="Delete"
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2 }
        }}
        zoomOnScroll={false}
        zoomOnPinch={true}
        panOnScroll={true}
        nodesDraggable={true}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'startNode':
                return '#4CAF50';
              case 'signalNode':
                return '#2196F3';
              case 'actionNode':
                return '#FF9800';
              case 'endNode':
                return '#F44336';
              case 'forceEndNode':
                return '#9C27B0';
              default:
                return '#eee';
            }
          }}
        />
        
        <TopToolbar toggleTheme={toggleTheme} />
        <BottomToolbar 
          resetStrategy={resetStrategy} 
          onImportSuccess={onImportSuccess}
        />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowCanvas;
