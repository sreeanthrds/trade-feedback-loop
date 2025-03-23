
import React from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  NodeTypes,
  EdgeProps
} from '@xyflow/react';
import TopToolbar from './toolbars/TopToolbar';
import BottomToolbar from './toolbars/BottomToolbar';
import StartNode from './nodes/StartNode';
import SignalNode from './nodes/SignalNode';
import ActionNode from './nodes/ActionNode';
import EndNode from './nodes/EndNode';
import ForceEndNode from './nodes/ForceEndNode';
import NodeControls from './NodeControls';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

// Custom edge with delete button
const ButtonEdge = ({ id, ...props }: EdgeProps & { id: string; onDelete: (id: string) => void }) => {
  const { onDelete } = props;
  
  return (
    <>
      {/* Use the default edge */}
      <props.defaultEdgeComponent {...props} />
      
      {/* Add a delete button */}
      <foreignObject
        width={20}
        height={20}
        x={(props.sourceX + props.targetX) / 2 - 10}
        y={(props.sourceY + props.targetY) / 2 - 10}
        requiredExtensions="http://www.w3.org/1999/xhtml"
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
  onDeleteEdge
}) => {
  // Create node types with delete functionality
  const nodeTypes: NodeTypes = {
    startNode: (props) => <StartNode {...props} />,
    signalNode: (props) => (
      <>
        <SignalNode {...props} />
        <NodeControls node={props} onDelete={onDeleteNode} />
      </>
    ),
    actionNode: (props) => (
      <>
        <ActionNode {...props} />
        <NodeControls node={props} onDelete={onDeleteNode} />
      </>
    ),
    endNode: (props) => (
      <>
        <EndNode {...props} />
        <NodeControls node={props} onDelete={onDeleteNode} />
      </>
    ),
    forceEndNode: (props) => (
      <>
        <ForceEndNode {...props} />
        <NodeControls node={props} onDelete={onDeleteNode} />
      </>
    )
  };

  // Create edges with delete buttons
  const edgesWithDeleteButtons = edges.map(edge => ({
    ...edge,
    data: {
      ...edge.data,
      onDelete: onDeleteEdge
    }
  }));

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
        edgeTypes={{
          default: (props) => <ButtonEdge {...props} onDelete={onDeleteEdge} />
        }}
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
