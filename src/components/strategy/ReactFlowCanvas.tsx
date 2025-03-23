
import React from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Edge
} from '@xyflow/react';
import TopToolbar from './toolbars/TopToolbar';
import BottomToolbar from './toolbars/BottomToolbar';
import { createNodeTypes } from './nodes/nodeTypes';
import { createEdgeTypes } from './edges/edgeTypes';

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
    () => createEdgeTypes(onDeleteEdge),
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
