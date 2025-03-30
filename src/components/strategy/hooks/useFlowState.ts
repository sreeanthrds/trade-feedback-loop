
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
import { toast } from '@/hooks/use-toast';

export function useFlowState() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const strategyStore = useStrategyStore();
  const isInitializedRef = useRef(false);
  const onConnectMemoizedRef = useRef(null);
  const [storeInitialized, setStoreInitialized] = useState(false);
  const updateHandlingRef = useRef(false);
  
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
  
  // Only initialize store after ReactFlow is ready and initial load is complete
  useEffect(() => {
    if (!isInitializedRef.current && reactFlowInstance && !isInitialLoadRef.current) {
      isInitializedRef.current = true;
      
      // Delay the store initialization to ensure initial load is complete
      const syncTimeout = setTimeout(() => {
        setStoreInitialized(true);
      }, 3000); // Longer delay for initialization
      
      return () => clearTimeout(syncTimeout);
    }
  }, [reactFlowInstance, isInitialLoadRef.current]);
  
  // Create onConnect handler with nodes that doesn't recreate on every render
  const onConnect = useMemo(() => {
    // Store the current handler in a ref to avoid recreating it constantly
    onConnectMemoizedRef.current = (params) => baseOnConnect(params, nodes);
    return onConnectMemoizedRef.current;
  }, [baseOnConnect, nodes]);

  // Close panel handler
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  }, [setIsPanelOpen, setSelectedNode]);

  // Create stable handler for adding nodes
  const handleAddNode = useCallback((type: string, parentNodeId?: string) => {
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
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
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [reactFlowInstance, reactFlowWrapper, nodes, edges, setNodes, setEdges, strategyStore]);

  // Create stable handler for updating node data - most important for fixing the loop
  const updateNodeData = useCallback((id: string, data: any) => {
    // Prevent recursive update loops
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    setTimeout(() => {
      try {
        const handler = createUpdateNodeDataHandler(
          nodes,
          setNodes,
          strategyStore
        );
        handler(id, data);
      } finally {
        // Reset the flag after a delay
        setTimeout(() => {
          updateHandlingRef.current = false;
        }, 100);
      }
    }, 0);
  }, [nodes, setNodes, strategyStore]);
  
  // Create stable handler for deleting nodes
  const handleDeleteNode = useCallback((id: string) => {
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
      const handler = createDeleteNodeHandler(
        nodes,
        edges,
        setNodes,
        setEdges,
        strategyStore
      );
      handler(id);
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [nodes, edges, setNodes, setEdges, strategyStore]);

  // Create stable handler for deleting edges
  const handleDeleteEdge = useCallback((id: string) => {
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
      // Filter out the edge with the given id
      const newEdges = edges.filter(edge => edge.id !== id);
      setEdges(newEdges);
      
      // Update store
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(nodes, newEdges);
      
      toast({
        title: "Edge deleted",
        description: "Connection has been removed."
      });
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [edges, nodes, setEdges, strategyStore]);

  // Create strategy reset handler
  const resetStrategy = useCallback(() => {
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
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
        }, 100);
      }
      
      toast({
        title: "Strategy reset",
        description: "Strategy has been reset to initial state."
      });
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [initialNodes, setNodes, setEdges, strategyStore, closePanel, reactFlowInstance]);

  // Create import success handler
  const handleImportSuccess = useCallback(() => {
    // Fit view after successful import
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 200);
    }
    
    // Close panel if open
    closePanel();
    
    toast({
      title: "Import successful",
      description: "Strategy imported successfully."
    });
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
    // Handlers
    handleAddNode,
    handleDeleteNode,
    handleDeleteEdge,
    updateNodeData,
    closePanel,
    resetStrategy,
    handleImportSuccess
  };
}
