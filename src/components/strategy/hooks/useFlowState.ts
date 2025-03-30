
import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useReactFlow, Node } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { initialNodes } from '../utils/flowUtils';
import { useNodeStateManagement } from './useNodeStateManagement';
import { useEdgeStateManagement } from './useEdgeStateManagement';
import { useLocalStorageSync } from './useLocalStorageSync';
import { usePanelState } from './usePanelState';
import { 
  createNodeClickHandler, 
  createAddNodeHandler,
  createUpdateNodeDataHandler,
  createDeleteNodeHandler
} from '../utils/handlers';

export function useFlowState() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const strategyStore = useStrategyStore();
  const isInitializedRef = useRef(false);
  const onConnectMemoizedRef = useRef(null);
  const [storeInitialized, setStoreInitialized] = useState(false);
  
  // Node state management
  const {
    nodes,
    setNodes,
    onNodesChange,
    selectedNode,
    setSelectedNode,
    isDraggingRef
  } = useNodeStateManagement(initialNodes, strategyStore);
  
  // Edge state management
  const {
    edges,
    setEdges,
    onEdgesChange,
    onConnect: baseOnConnect
  } = useEdgeStateManagement([], strategyStore);
  
  // Panel state
  const { isPanelOpen, setIsPanelOpen } = usePanelState();
  
  // Sync with localStorage - only run once
  const { isInitialLoadRef } = useLocalStorageSync(
    setNodes,
    setEdges,
    strategyStore,
    initialNodes
  );
  
  // Track store nodes/edges for sync
  const storeNodes = strategyStore.nodes;
  const storeEdges = strategyStore.edges;
  
  // First ensure we only sync nodes from store to ReactFlow when not dragging and not in initial load
  useEffect(() => {
    // Skip during dragging or initial load
    if (isDraggingRef.current || isInitialLoadRef.current || !storeInitialized) {
      return;
    }
    
    // Check if there are actual differences to avoid unnecessary updates
    const nodesChanged = JSON.stringify(storeNodes.map(n => ({ id: n.id, position: n.position, data: n.data }))) !== 
                         JSON.stringify(nodes.map(n => ({ id: n.id, position: n.position, data: n.data })));
    
    if (nodesChanged) {
      const timeoutId = setTimeout(() => {
        setNodes(storeNodes);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [storeNodes, nodes, setNodes, isDraggingRef, isInitialLoadRef, storeInitialized]);
  
  // Then sync edges from store to ReactFlow
  useEffect(() => {
    // Skip during initial load
    if (isInitialLoadRef.current || !storeInitialized) {
      return;
    }
    
    // Compare edges to detect changes
    const edgesChanged = JSON.stringify(storeEdges.map(e => ({ id: e.id, source: e.source, target: e.target }))) !== 
                         JSON.stringify(edges.map(e => ({ id: e.id, source: e.source, target: e.target })));
    
    if (edgesChanged) {
      const timeoutId = setTimeout(() => {
        setEdges(storeEdges);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [storeEdges, edges, setEdges, isInitialLoadRef, storeInitialized]);
  
  // Only initialize store after ReactFlow is ready and initial load is complete
  useEffect(() => {
    if (!isInitializedRef.current && reactFlowInstance && !isInitialLoadRef.current) {
      isInitializedRef.current = true;
      
      // Delay the store initialization to ensure initial load is complete
      const syncTimeout = setTimeout(() => {
        setStoreInitialized(true);
      }, 2000); // Longer delay for initialization
      
      return () => clearTimeout(syncTimeout);
    }
  }, [reactFlowInstance, isInitialLoadRef.current]);
  
  // Create onConnect handler with nodes that doesn't recreate on every render
  const onConnect = useMemo(() => {
    // Store the current handler in a ref to avoid recreating it constantly
    onConnectMemoizedRef.current = (params) => baseOnConnect(params, nodes);
    return onConnectMemoizedRef.current;
  }, [baseOnConnect, nodes]);

  // Close panel handler (moved from usePanelHandlers)
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  }, [setIsPanelOpen, setSelectedNode]);

  // Create stable handler for adding nodes
  const handleAddNode = useCallback((type: string, parentNodeId?: string) => {
    const handler = createAddNodeHandler(
      reactFlowInstance,
      reactFlowWrapper,
      nodes,
      edges,
      setNodes,
      setEdges,
      strategyStore
    );
    handler(type, parentNodeId);
  }, [reactFlowInstance, reactFlowWrapper, nodes, edges, setNodes, setEdges, strategyStore]);

  // Create stable handler for updating node data
  const updateNodeData = useCallback((id: string, data: any) => {
    const handler = createUpdateNodeDataHandler(
      nodes,
      setNodes,
      strategyStore
    );
    handler(id, data);
  }, [nodes, setNodes, strategyStore]);
  
  // Create stable handler for deleting nodes
  const handleDeleteNode = useCallback((id: string) => {
    const handler = createDeleteNodeHandler(
      nodes,
      edges,
      setNodes,
      setEdges,
      strategyStore
    );
    handler(id);
  }, [nodes, edges, setNodes, setEdges, strategyStore]);

  // Create stable handler for deleting edges
  const handleDeleteEdge = useCallback((id: string) => {
    // Filter out the edge with the given id
    const newEdges = edges.filter(edge => edge.id !== id);
    setEdges(newEdges);
    
    // Update store
    strategyStore.setEdges(newEdges);
    strategyStore.addHistoryItem(nodes, newEdges);
  }, [edges, nodes, setEdges, strategyStore]);

  // Create strategy import and reset handlers
  const resetStrategy = useCallback(() => {
    // Reset to initial state
    setNodes(initialNodes);
    setEdges([]);
    
    // Update store
    strategyStore.setNodes(initialNodes);
    strategyStore.setEdges([]);
    strategyStore.resetHistory();
    strategyStore.addHistoryItem(initialNodes, []);
    
    // Clear selection and close panel
    closePanel();
    
    // Fit view after reset
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 50);
    }
  }, [initialNodes, setNodes, setEdges, strategyStore, closePanel, reactFlowInstance]);

  const handleImportSuccess = useCallback(() => {
    // Fit view after successful import
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
    
    // Close panel if open
    closePanel();
  }, [reactFlowInstance, closePanel]);

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
    strategyStore,
    // New handlers
    handleAddNode,
    handleDeleteNode,
    handleDeleteEdge,
    updateNodeData,
    closePanel,
    resetStrategy,
    handleImportSuccess
  };
}
