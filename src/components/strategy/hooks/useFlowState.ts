
import { useRef, useState } from 'react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { initialNodes } from '../utils/flowUtils';
import { useNodeStateManagement } from './useNodeStateManagement';
import { useEdgeStateManagement } from './useEdgeStateManagement';
import { useLocalStorageSync } from './useLocalStorageSync';
import { usePanelState } from './usePanelState';
import { useWorkflowValidation } from './flow-state/useWorkflowValidation';
import { useReactFlowRefs } from './flow-state/useReactFlowRefs';
import { useStrategyInitialization } from './flow-state/useStrategyInitialization';
import { useStrategyOperations } from './flow-state/useStrategyOperations';
import { useConnectHandler } from './flow-state/useConnectHandler';
import { 
  useNodeHandlers, 
  useEdgeHandlers, 
  usePanelHandlers,
  useStrategyHandlers
} from './flow-handlers';
import { useSearchParams } from 'react-router-dom';

export function useFlowState(isNew: boolean = false) {
  const strategyStore = useStrategyStore();
  const [searchParams] = useSearchParams();
  const currentStrategyId = searchParams.get('id') || '';
  
  // Get refs and instance management 
  const {
    reactFlowWrapper,
    reactFlowInstance,
    updateHandlingRef
  } = useReactFlowRefs();
  
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
  
  // Connect handler with node awareness
  const onConnect = useConnectHandler(baseOnConnect, nodes);
  
  // Initialize with new strategy if isNew is true
  useStrategyInitialization({
    isNew,
    setNodes,
    setEdges,
    strategyStore
  });
  
  // Sync with localStorage - only run if not creating a new strategy
  const { isInitialLoadRef } = !isNew ? useLocalStorageSync({
    setNodes,
    setEdges,
    strategyStore,
    initialNodes,
    currentStrategyId
  }) : { isInitialLoadRef: { current: false } };
  
  // Workflow validation
  const { 
    validateCurrentWorkflow,
    validateBeforeCriticalOperation,
    isWorkflowValid
  } = useWorkflowValidation();
  
  // Strategy operation handlers
  const { validateAndRunOperation } = useStrategyOperations({
    validateBeforeCriticalOperation
  });

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
