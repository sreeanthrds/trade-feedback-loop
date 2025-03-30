import { useCallback, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { useNodeBasicState } from './node-state/useNodeBasicState';
import { useDragDetection } from './node-state/useDragDetection';
import { useNodeUpdates } from './node-state/useNodeUpdates';
import { useThrottledNodeUpdates } from './node-state/useThrottledNodeUpdates';
import { useCustomSetNodes } from './node-state/useCustomSetNodes';
import { useCustomNodesChange } from './node-state/useCustomNodesChange';
import { useSelectedNodeUpdate } from './node-state/useSelectedNodeUpdate';

/**
 * Hook to manage node state with optimized update handling
 */
export function useNodeStateManagement(initialNodes: Node[], strategyStore: any) {
  // Basic state management
  const {
    nodes,
    setLocalNodes,
    onNodesChange,
    selectedNode,
    setSelectedNode,
    isDraggingRef
  } = useNodeBasicState(initialNodes);

  // Drag detection and handling
  const {
    pendingNodesUpdate,
    onNodesChangeWithDragDetection
  } = useDragDetection();

  // Node update optimizations
  const {
    lastUpdateTimeRef,
    updateTimeoutRef,
    updateCycleRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    shouldUpdateNodes
  } = useNodeUpdates(strategyStore);

  // Connect drag detection to node changes
  const handleUpdateAfterDrag = useCallback((nodesToUpdate) => {
    processStoreUpdate(nodesToUpdate);
  }, [processStoreUpdate]);

  // Specialized drag-aware node change handler
  const enhancedDragHandler = useCallback((changes, baseChangeHandler) => {
    onNodesChangeWithDragDetection(changes, baseChangeHandler, handleUpdateAfterDrag);
  }, [onNodesChangeWithDragDetection, handleUpdateAfterDrag]);

  // Custom node change handler with processing guards
  const { 
    customNodesChangeHandler: onNodesChangeWithProcessing,
    isProcessingChangesRef
  } = useCustomNodesChange(enhancedDragHandler, onNodesChange);

  // Custom setNodes implementation with optimizations
  const setNodes = useCustomSetNodes({
    setLocalNodes,
    isDraggingRef,
    pendingNodesUpdate,
    lastUpdateTimeRef,
    updateTimeoutRef,
    updateCycleRef,
    storeUpdateInProgressRef,
    shouldUpdateNodes,
    processStoreUpdate
  });

  // Process throttled updates
  useThrottledNodeUpdates({
    pendingNodesUpdate,
    lastUpdateTimeRef,
    updateTimeoutRef,
    processStoreUpdate
  });

  // Keep selected node in sync with node updates
  useSelectedNodeUpdate(nodes, selectedNode, setSelectedNode);

  return {
    nodes,
    setNodes,
    onNodesChange: onNodesChangeWithProcessing,
    selectedNode,
    setSelectedNode,
    isDraggingRef
  };
}
