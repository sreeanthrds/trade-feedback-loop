
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Connection,
  NodeTypes,
  OnConnect,
  NodeMouseHandler,
  useReactFlow,
} from '@xyflow/react';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/use-theme';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { 
  initialNodes, 
  addNode, 
  validateConnection,
  loadStrategyFromLocalStorage
} from './utils/flowUtils';
import TopToolbar from './toolbars/TopToolbar';
import BottomToolbar from './toolbars/BottomToolbar';
import NodePanel from './NodePanel';
import NodeSidebar from './NodeSidebar';
import StartNode from './nodes/StartNode';
import SignalNode from './nodes/SignalNode';
import ActionNode from './nodes/ActionNode';
import EndNode from './nodes/EndNode';
import ForceEndNode from './nodes/ForceEndNode';
import '@xyflow/react/dist/style.css';
import './StrategyFlow.css';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';

const nodeTypes: NodeTypes = {
  startNode: StartNode,
  signalNode: SignalNode,
  actionNode: ActionNode,
  endNode: EndNode,
  forceEndNode: ForceEndNode
};

const StrategyFlow = () => {
  const { theme, setTheme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  
  const strategyStore = useStrategyStore();

  // Initial load from localStorage
  useEffect(() => {
    const savedStrategy = loadStrategyFromLocalStorage();
    if (savedStrategy) {
      setNodes(savedStrategy.nodes);
      setEdges(savedStrategy.edges);
      strategyStore.setNodes(savedStrategy.nodes);
      strategyStore.setEdges(savedStrategy.edges);
    } else {
      strategyStore.setNodes(initialNodes);
      strategyStore.resetHistory();
      strategyStore.addHistoryItem(initialNodes, []);
    }
  }, []);

  // Sync nodes and edges from store to ReactFlow
  useEffect(() => {
    if (strategyStore.nodes.length > 0) {
      setNodes(strategyStore.nodes);
    }
    if (strategyStore.edges.length > 0 || strategyStore.edges.length === 0) {
      setEdges(strategyStore.edges);
    }
  }, [strategyStore.nodes, strategyStore.edges, setNodes, setEdges]);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      if (!validateConnection(params, nodes)) return;
      
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(nodes, newEdges);
    },
    [nodes, edges, setEdges, strategyStore]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node: Node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  }, []);

  const handleAddNode = (type: string) => {
    const newNode = addNode(type, reactFlowInstance, reactFlowWrapper, nodes);
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    strategyStore.setNodes(newNodes);
    strategyStore.addHistoryItem(newNodes, edges);
  };

  const updateNodeData = (id: string, data: any) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    strategyStore.setNodes(updatedNodes);
    strategyStore.addHistoryItem(updatedNodes, edges);
  };

  const resetStrategy = () => {
    if (window.confirm("Are you sure you want to reset the strategy? All changes will be lost.")) {
      setNodes(initialNodes);
      setEdges([]);
      strategyStore.setNodes(initialNodes);
      strategyStore.setEdges([]);
      strategyStore.resetHistory();
      strategyStore.addHistoryItem(initialNodes, []);
      setSelectedNode(null);
      setIsPanelOpen(false);
      toast.success("Strategy reset to initial state");
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleImportSuccess = () => {
    // Force a layout update after import
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2 });
      }
    }, 100);
  };

  return (
    <div className="strategy-flow-container h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={15} minSize={12} maxSize={20} className="bg-secondary/30">
          <NodeSidebar onAddNode={handleAddNode} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={isPanelOpen ? 65 : 85}>
          <div className="h-full w-full" ref={reactFlowWrapper}>
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
                onImportSuccess={handleImportSuccess}
              />
            </ReactFlow>
          </div>
        </ResizablePanel>
        
        {isPanelOpen && selectedNode && (
          <ResizablePanel defaultSize={20} minSize={20} maxSize={35}>
            <NodePanel 
              node={selectedNode} 
              updateNodeData={updateNodeData} 
              onClose={closePanel} 
            />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default StrategyFlow;
