
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
  const isDraggingRef = useRef(false);
  const pendingNodesUpdate = useRef<Node[] | null>(null);
  const lastUpdateTimeRef = useRef(0);
  const updateTimeoutRef = useRef<number | null>(null);

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

  // Enhanced node change handler with improved drag detection
  const onNodesChangeWithDragDetection = useCallback((changes) => {
    // Apply the changes to nodes immediately for UI responsiveness
    onNodesChange(changes);
    
    // Detect drag operations
    const dragChange = changes.find(change => 
      change.type === 'position' && change.dragging !== undefined
    );
    
    if (dragChange) {
      if (dragChange.dragging) {
        // Drag started or continuing
        isDraggingRef.current = true;
      } else if (isDraggingRef.current) {
        // Drag ended
        isDraggingRef.current = false;
        
        // Apply the pending update once the drag is complete
        if (pendingNodesUpdate.current) {
          strategyStore.setNodes(pendingNodesUpdate.current);
          strategyStore.addHistoryItem(pendingNodesUpdate.current, strategyStore.edges);
          pendingNodesUpdate.current = null;
        }
      }
    }
  }, [onNodesChange, strategyStore]);

  // Custom setNodes wrapper with improved throttling
  const setNodesAndStore = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    // Always update local state for UI responsiveness
    setNodes((prevNodes) => {
      // Handle both functional and direct updates
      const newNodes = typeof updatedNodes === 'function' 
        ? updatedNodes(prevNodes) 
        : updatedNodes;
      
      // Don't update store during dragging
      if (isDraggingRef.current) {
        pendingNodesUpdate.current = newNodes;
        return newNodes;
      }
      
      // Throttle updates to the store during frequent operations
      const now = Date.now();
      if (now - lastUpdateTimeRef.current > 100) {
        lastUpdateTimeRef.current = now;
        
        // Clear any pending timeout
        if (updateTimeoutRef.current !== null) {
          window.clearTimeout(updateTimeoutRef.current);
          updateTimeoutRef.current = null;
        }
        
        // Schedule the update to the store
        updateTimeoutRef.current = window.setTimeout(() => {
          strategyStore.setNodes(newNodes);
        }, 50);
      } else {
        pendingNodesUpdate.current = newNodes;
      }
      
      return newNodes;
    });
  }, [setNodes, strategyStore]);

  // Set up a cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        window.clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Sync nodes from store to ReactFlow
  useEffect(() => {
    if (isDraggingRef.current || isInitialLoad.current) return;
    
    const storeNodes = strategyStore.nodes;
    if (storeNodes.length > 0 && 
        JSON.stringify(storeNodes.map(n => ({ id: n.id, type: n.type, data: n.data }))) !== 
        JSON.stringify(nodes.map(n => ({ id: n.id, type: n.type, data: n.data })))) {
      setNodes(storeNodes);
    }
  }, [strategyStore.nodes, setNodes, nodes]);

  // Sync edges from store to ReactFlow
  useEffect(() => {
    if (isInitialLoad.current) return;
    
    const storeEdges = strategyStore.edges;
    if (JSON.stringify(storeEdges) !== JSON.stringify(edges)) {
      setEdges(storeEdges);
    }
  }, [strategyStore.edges, setEdges, edges]);

  // Handle connections with validation
  const onConnect = useCallback(
    (params: Connection) => {
      if (!validateConnection(params, nodes)) return;
      
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      
      // Avoid store updates during dragging
      if (!isDraggingRef.current) {
        strategyStore.setEdges(newEdges);
        strategyStore.addHistoryItem(nodes, newEdges);
      }
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
    onNodesChange: onNodesChangeWithDragDetection,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setIsPanelOpen,
    setNodes: setNodesAndStore,
    setEdges,
    strategyStore
  };
}
