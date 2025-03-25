
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

  // Custom setNodes wrapper to ensure both local state and store are updated
  const setNodesAndStore = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    console.log('setNodesAndStore called');
    
    // Handle both functional and direct updates
    if (typeof updatedNodes === 'function') {
      setNodes((prevNodes) => {
        const newNodes = updatedNodes(prevNodes);
        console.log('Updating nodes with function, count:', newNodes.length);
        strategyStore.setNodes(newNodes);
        return newNodes;
      });
    } else {
      console.log('Updating nodes directly, count:', updatedNodes.length);
      setNodes(updatedNodes);
      strategyStore.setNodes(updatedNodes);
    }
  }, [setNodes, strategyStore]);

  // Sync nodes from store to ReactFlow, but prevent infinite updates by checking for changes
  useEffect(() => {
    const storeNodes = strategyStore.nodes;
    if (storeNodes.length > 0 && JSON.stringify(storeNodes) !== JSON.stringify(nodes)) {
      console.log('Syncing nodes from store, count:', storeNodes.length);
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
    setNodes: setNodesAndStore, // Use the wrapped version
    setEdges,
    strategyStore
  };
}
