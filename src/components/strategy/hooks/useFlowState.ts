
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
  const isInitialLoad = useRef(true);

  // Initial load from localStorage - only run once
  useEffect(() => {
    if (isInitialLoad.current) {
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
      isInitialLoad.current = false;
    }
  }, []);

  // Custom setNodes wrapper to ensure both local state and store are updated
  // But throttle updates to the store during node drag operations
  const setNodesAndStore = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    // Handle both functional and direct updates
    if (typeof updatedNodes === 'function') {
      setNodes((prevNodes) => {
        const newNodes = updatedNodes(prevNodes);
        
        // Only update store if not a position update (during dragging)
        const isDragOperation = prevNodes.length === newNodes.length && 
          newNodes.some((node, i) => 
            node.position.x !== prevNodes[i].position.x || 
            node.position.y !== prevNodes[i].position.y
          );
          
        if (!isDragOperation) {
          strategyStore.setNodes(newNodes);
        }
        
        return newNodes;
      });
    } else {
      setNodes(updatedNodes);
      strategyStore.setNodes(updatedNodes);
    }
  }, [setNodes, strategyStore]);

  // Sync nodes from store to ReactFlow, but prevent infinite updates by checking for changes
  // Don't sync during drag operations
  useEffect(() => {
    const storeNodes = strategyStore.nodes;
    if (storeNodes.length > 0 && 
        JSON.stringify(storeNodes.map(n => ({ id: n.id, type: n.type, data: n.data }))) !== 
        JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, data: n.data })))) {
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
