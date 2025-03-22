
import React, { useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  NodeTypes,
  useReactFlow,
  useOnViewportChange,
  Position
} from '@xyflow/react';
import TopToolbar from './toolbars/TopToolbar';
import BottomToolbar from './toolbars/BottomToolbar';
import StartNode from './nodes/StartNode';
import SignalNode from './nodes/SignalNode';
import ActionNode from './nodes/ActionNode';
import EndNode from './nodes/EndNode';
import ForceEndNode from './nodes/ForceEndNode';
import NodeControls from './node-controls/NodeControls';
import EdgeControls from './edge-controls/EdgeControls';

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  signalNode: SignalNode,
  actionNode: ActionNode,
  endNode: EndNode,
  forceEndNode: ForceEndNode
};

interface ReactFlowCanvasProps {
  flowRef: React.RefObject<HTMLDivElement>;
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  onNodeDoubleClick: any;
  addNodeOnConnection: (sourceNodeId: string, nodeType: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  toggleTheme: () => void;
  resetStrategy: () => void;
  onImportSuccess: () => void;
}

const ReactFlowCanvas: React.FC<ReactFlowCanvasProps> = ({
  flowRef,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onNodeDoubleClick,
  addNodeOnConnection,
  onDeleteNode,
  onDeleteEdge,
  toggleTheme,
  resetStrategy,
  onImportSuccess
}) => {
  const reactFlowInstance = useReactFlow();
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  useOnViewportChange({
    onEnd: () => {
      // Reset hover states when user navigates
      setHoveredNodeId(null);
      setHoveredEdgeId(null);
    }
  });

  const handleNodeMouseEnter = (event: React.MouseEvent, node: any) => {
    setHoveredNodeId(node.id);
  };

  const handleNodeMouseLeave = () => {
    setHoveredNodeId(null);
  };

  const handleEdgeMouseEnter = (event: React.MouseEvent, edge: any) => {
    setHoveredEdgeId(edge.id);
  };

  const handleEdgeMouseLeave = () => {
    setHoveredEdgeId(null);
  };

  return (
    <div className="h-full w-full" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onEdgeMouseEnter={handleEdgeMouseEnter}
        onEdgeMouseLeave={handleEdgeMouseLeave}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2 }
        }}
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

        {/* Node Controls - render action buttons on hover */}
        {hoveredNodeId && (
          <NodeControls 
            nodeId={hoveredNodeId}
            nodes={nodes}
            addNodeOnConnection={addNodeOnConnection}
            onDeleteNode={onDeleteNode}
          />
        )}

        {/* Edge Controls - render delete button on hover */}
        {hoveredEdgeId && (
          <EdgeControls 
            edgeId={hoveredEdgeId}
            onDeleteEdge={onDeleteEdge}
          />
        )}
      </ReactFlow>
    </div>
  );
};

export default ReactFlowCanvas;
