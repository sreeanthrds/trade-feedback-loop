import React, { useState, useCallback, useRef } from 'react';
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
  NodeTypes,
  OnConnect,
  NodeMouseHandler,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { create } from 'zustand';
import { 
  Plus, Play, Save, RotateCcw, Undo, Redo, 
  AlertTriangle, Download, Upload, Moon, Sun
} from 'lucide-react';
import { toast } from 'sonner';
import NodePanel from './NodePanel';
import StartNode from './nodes/StartNode';
import SignalNode from './nodes/SignalNode';
import ActionNode from './nodes/ActionNode';
import EndNode from './nodes/EndNode';
import ForceEndNode from './nodes/ForceEndNode';
import NodeSidebar from './NodeSidebar';
import '@xyflow/react/dist/style.css';
import './StrategyFlow.css';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';

interface StrategyStore {
  nodes: Node[];
  edges: Edge[];
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addHistoryItem: (nodes: Node[], edges: Edge[]) => void;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;
}

const useStrategyStore = create<StrategyStore>((set) => ({
  nodes: [],
  edges: [],
  history: [],
  historyIndex: -1,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addHistoryItem: (nodes, edges) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }),
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const prevState = state.history[state.historyIndex - 1];
      return {
        nodes: prevState.nodes,
        edges: prevState.edges,
        historyIndex: state.historyIndex - 1,
      };
    }
    return state;
  }),
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1];
      return {
        nodes: nextState.nodes,
        edges: nextState.edges,
        historyIndex: state.historyIndex + 1,
      };
    }
    return state;
  }),
  resetHistory: () => set({
    history: [],
    historyIndex: -1,
  }),
}));

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 250, y: 50 },
    data: { label: 'Start' }
  }
];

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

  React.useEffect(() => {
    const savedStrategy = localStorage.getItem('tradyStrategy');
    if (savedStrategy) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedStrategy);
        setNodes(savedNodes);
        setEdges(savedEdges);
        strategyStore.setNodes(savedNodes);
        strategyStore.setEdges(savedEdges);
      } catch (error) {
        console.error('Failed to load strategy:', error);
      }
    } else {
      strategyStore.setNodes(initialNodes);
      strategyStore.resetHistory();
      strategyStore.addHistoryItem(initialNodes, []);
    }
  }, []);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);
      
      if (sourceNode?.type === 'endNode' || sourceNode?.type === 'forceEndNode') {
        toast.error("End nodes cannot have outgoing connections");
        return;
      }
      
      if (targetNode?.type === 'startNode') {
        toast.error("Start nodes cannot have incoming connections");
        return;
      }
      
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

  const addNode = (type: string) => {
    const position = reactFlowInstance.getViewport 
      ? reactFlowInstance.screenToFlowPosition({
          x: (reactFlowWrapper.current?.clientWidth || 800) / 2,
          y: (reactFlowWrapper.current?.clientHeight || 600) / 2,
        })
      : { x: 250, y: 250 };
    
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position,
      data: { 
        label: type === 'startNode' 
          ? 'Start' 
          : type === 'endNode' 
            ? 'End' 
            : type === 'forceEndNode'
              ? 'Force End'
              : type === 'signalNode' 
                ? 'Signal' 
                : 'Action'
      }
    };
    
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

  const saveStrategy = () => {
    const strategy = { nodes, edges };
    localStorage.setItem('tradyStrategy', JSON.stringify(strategy));
    toast.success("Strategy saved successfully");
  };

  const exportStrategy = () => {
    const strategy = { nodes, edges };
    const blob = new Blob([JSON.stringify(strategy, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trady-strategy-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Strategy exported successfully");
  };

  const importStrategy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (imported.nodes && imported.edges) {
            setNodes(imported.nodes);
            setEdges(imported.edges);
            strategyStore.setNodes(imported.nodes);
            strategyStore.setEdges(imported.edges);
            strategyStore.resetHistory();
            strategyStore.addHistoryItem(imported.nodes, imported.edges);
            toast.success("Strategy imported successfully");
          } else {
            toast.error("Invalid strategy file format");
          }
        } catch (error) {
          toast.error("Failed to parse strategy file");
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
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

  return (
    <div className="strategy-flow-container h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={15} minSize={12} maxSize={20} className="bg-secondary/30">
          <NodeSidebar onAddNode={addNode} />
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
              
              <Panel position="top-center">
                <div className="flex gap-2 bg-background/90 p-2 rounded-md shadow-md">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => strategyStore.undo()}
                    disabled={strategyStore.historyIndex <= 0}
                  >
                    <Undo className="h-4 w-4" />
                    <span className="sr-only">Undo</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => strategyStore.redo()}
                    disabled={strategyStore.historyIndex >= strategyStore.history.length - 1}
                  >
                    <Redo className="h-4 w-4" />
                    <span className="sr-only">Redo</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span className="sr-only">Toggle Theme</span>
                  </Button>
                </div>
              </Panel>
              
              <Panel position="bottom-center">
                <div className="flex gap-2 bg-background/90 p-2 rounded-md shadow-md">
                  <Button variant="secondary" onClick={saveStrategy}>
                    <Save className="mr-1 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="secondary" onClick={exportStrategy}>
                    <Download className="mr-1 h-4 w-4" />
                    Export
                  </Button>
                  <label htmlFor="import-strategy" className="cursor-pointer">
                    <Button variant="secondary" className="w-full">
                      <Upload className="mr-1 h-4 w-4" />
                      Import
                    </Button>
                    <input
                      id="import-strategy"
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={importStrategy}
                    />
                  </label>
                  <Button variant="secondary" onClick={resetStrategy}>
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
