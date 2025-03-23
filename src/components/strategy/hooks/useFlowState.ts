
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  Node, 
  Edge, 
  Connection, 
  addEdge,
  useReactFlow
} from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { initialNodes, validateConnection, loadStrategyFromLocalStorage } from '../utils/flowUtils';

export function useFlowState() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  
  const strategyStore = useStrategyStore();

  // Initial load from localStorage - only run once
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

  // Sync nodes from store to ReactFlow, but prevent infinite updates by checking for changes
  useEffect(() => {
    const storeNodes = strategyStore.nodes;
    if (storeNodes.length > 0 && JSON.stringify(storeNodes) !== JSON.stringify(nodes)) {
      setNodes(storeNodes);
    }
  }, [strategyStore.nodes]);

  // Sync edges from store to ReactFlow, but prevent infinite updates by checking for changes
  useEffect(() => {
    const storeEdges = strategyStore.edges;
    if (JSON.stringify(storeEdges) !== JSON.stringify(edges)) {
      setEdges(storeEdges);
    }
  }, [strategyStore.edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!validateConnection(params, nodes)) return;
      
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(nodes, newEdges);
    },
    [nodes, edges, setEdges, strategyStore]
  );

  return {
    nodes,
    edges,
    selectedNode,
    isPanelOpen,
    reactFlowWrapper,
    reactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setIsPanelOpen,
    setNodes,
    setEdges,
    strategyStore
  };
}
