
import React, { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes
} from '@xyflow/react';
import { AlertCircle, Plus, Play, Save, RotateCcw } from 'lucide-react';
import NodePanel from './NodePanel';
import StartNode from './nodes/StartNode';
import SignalNode from './nodes/SignalNode';
import ActionNode from './nodes/ActionNode';
import EndNode from './nodes/EndNode';
import '@xyflow/react/dist/style.css';
import './StrategyFlow.css';
import { Button } from '@/components/ui/button';

// Define node types
const nodeTypes: NodeTypes = {
  startNode: StartNode,
  signalNode: SignalNode,
  actionNode: ActionNode,
  endNode: EndNode
};

// Initial nodes
const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 250, y: 50 },
    data: { label: 'Start' }
  }
];

// Initial edges
const initialEdges: Edge[] = [];

const StrategyFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);

  // Add a new node
  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${nodes.length + 1}`,
      type: type as any,
      position: { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: { 
        label: type === 'startNode' 
          ? 'Start' 
          : type === 'endNode' 
            ? 'End' 
            : type === 'signalNode' 
              ? 'Signal' 
              : 'Action'
      }
    };
    
    setNodes((nds) => nds.concat(newNode));
  };

  // Update node data
  const updateNodeData = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      })
    );
  };

  // Close the edit panel
  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="strategy-flow-container h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
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
              default:
                return '#eee';
            }
          }}
        />
        
        <Panel position="top-right">
          <div className="flex gap-2">
            <Button size="sm" onClick={() => addNode('startNode')}>
              <Plus className="mr-1 h-4 w-4" />
              Start
            </Button>
            <Button size="sm" onClick={() => addNode('signalNode')}>
              <Plus className="mr-1 h-4 w-4" />
              Signal
            </Button>
            <Button size="sm" onClick={() => addNode('actionNode')}>
              <Plus className="mr-1 h-4 w-4" />
              Action
            </Button>
            <Button size="sm" onClick={() => addNode('endNode')}>
              <Plus className="mr-1 h-4 w-4" />
              End
            </Button>
          </div>
        </Panel>
        
        <Panel position="bottom-left">
          <div className="flex gap-2">
            <Button variant="secondary">
              <Save className="mr-1 h-4 w-4" />
              Save
            </Button>
            <Button variant="secondary">
              <RotateCcw className="mr-1 h-4 w-4" />
              Reset
            </Button>
            <Button>
              <Play className="mr-1 h-4 w-4" />
              Backtest
            </Button>
          </div>
        </Panel>
      </ReactFlow>
      
      {selectedNode && isPanelOpen && (
        <NodePanel 
          node={selectedNode} 
          updateNodeData={updateNodeData} 
          onClose={closePanel} 
        />
      )}
    </div>
  );
};

export default StrategyFlow;
