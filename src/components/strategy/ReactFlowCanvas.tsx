
import React from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  NodeTypes,
} from '@xyflow/react';
import TopToolbar from './toolbars/TopToolbar';
import BottomToolbar from './toolbars/BottomToolbar';
import StartNode from './nodes/StartNode';
import SignalNode from './nodes/SignalNode';
import ActionNode from './nodes/ActionNode';
import EndNode from './nodes/EndNode';
import ForceEndNode from './nodes/ForceEndNode';

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
  toggleTheme,
  resetStrategy,
  onImportSuccess
}) => {
  return (
    <div className="h-full w-full" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
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
      </ReactFlow>
    </div>
  );
};

export default ReactFlowCanvas;
