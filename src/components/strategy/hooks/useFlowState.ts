
import { useRef, useEffect, useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { initialNodes } from '../utils/flowUtils';
import { useNodeStateManagement } from './useNodeStateManagement';
import { useEdgeStateManagement } from './useEdgeStateManagement';
import { useLocalStorageSync } from './useLocalStorageSync';
import { usePanelState } from './usePanelState';
import { useWorkflowValidation } from './useWorkflowValidation';
import { 
  useNodeHandlers, 
  useEdgeHandlers, 
  usePanelHandlers,
  useStrategyHandlers
} from './flow-handlers';

export function useFlowState(isNew: boolean = false) {
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
  
  // Edge state management with validation
  const {
    edges,
    setEdges,
    onEdgesChange,
    onConnect: baseOnConnect
  } = useEdgeStateManagement([], strategyStore);
  
  // Panel state
  const { isPanelOpen, setIsPanelOpen } = usePanelState();
  
  // Workflow validation
  const { 
    validateCurrentWorkflow,
    validateBeforeCriticalOperation,
    isWorkflowValid
  } = useWorkflowValidation();
  
  // Initialize with new strategy if isNew is true
  useEffect(() => {
    if (isNew) {
      console.log('Initializing new strategy with default nodes');
      setNodes(initialNodes);
      setEdges([]);
      strategyStore.setNodes(initialNodes);
      strategyStore.setEdges([]);
      strategyStore.resetHistory();
    }
  }, [isNew, setNodes, setEdges, strategyStore]);
  
  // Sync with localStorage - only run if not creating a new strategy
  const { isInitialLoadRef } = !isNew ? useLocalStorageSync({
    setNodes,
    setEdges,
    strategyStore,
    initialNodes
  }) : { isInitialLoadRef: { current: false } };
  
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
  const onConnect = useCallback((params) => {
    // Store the current handler in a ref to avoid recreating it constantly
    onConnectMemoizedRef.current = (params) => baseOnConnect(params, nodes);
    return onConnectMemoizedRef.current(params);
  }, [baseOnConnect, nodes]);

  // Panel handlers
  const { closePanel } = usePanelHandlers({
    setIsPanelOpen,
    setSelectedNode
  });

  // Node handlers
  const {
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode
  } = useNodeHandlers({
    nodes,
    edges,
    reactFlowInstance,
    reactFlowWrapper,
    setSelectedNode,
    setIsPanelOpen,
    setNodes,
    setEdges,
    strategyStore,
    updateHandlingRef
  });

  // Edge handlers
  const {
    handleDeleteEdge
  } = useEdgeHandlers({
    edges,
    nodes,
    setEdges,
    strategyStore,
    updateHandlingRef
  });

  // Strategy handlers with validation
  const {
    resetStrategy,
    handleImportSuccess
  } = useStrategyHandlers({
    strategyStore,
    nodes,
    setNodes,
    setEdges,
    reactFlowInstance,
    closePanel,
    updateHandlingRef
  });
  
  // Validate workflow on critical operations
  const validateAndRunOperation = useCallback(
    async (operation: () => void, operationName: string) => {
      const isValid = await validateBeforeCriticalOperation(operationName);
      if (isValid) {
        operation();
      }
    },
    [validateBeforeCriticalOperation]
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
    strategyStore,
    // Handlers
    onNodeClick,
    handleAddNode,
    handleDeleteNode,
    handleDeleteEdge,
    updateNodeData,
    closePanel,
    resetStrategy,
    handleImportSuccess,
    // Validation
    validateCurrentWorkflow,
    validateBeforeCriticalOperation,
    isWorkflowValid,
    validateAndRunOperation
  };
}
