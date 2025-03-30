
import { useCallback, useRef } from 'react';
import { Node } from '@xyflow/react';
import { deepEqual } from '../../utils/deepEqual';

/**
 * Hook to manage throttled node updates and prevent update cycles
 */
export function useNodeUpdates(strategyStore: any) {
  const lastUpdateTimeRef = useRef(0);
  const updateTimeoutRef = useRef<number | null>(null);
  const updateCycleRef = useRef(false);
  const isProcessingChangesRef = useRef(false);
  const storeUpdateInProgressRef = useRef(false);
  
  // Process store updates with throttling
  const processStoreUpdate = useCallback((newNodes: Node[]) => {
    if (updateCycleRef.current || storeUpdateInProgressRef.current) return;
    
    updateCycleRef.current = true;
    storeUpdateInProgressRef.current = true;
    
    try {
      strategyStore.setNodes(newNodes);
      strategyStore.addHistoryItem(newNodes, strategyStore.edges);
    } catch (error) {
      console.error('Error updating store after drag:', error);
    } finally {
      // Reset flags after a delay
      setTimeout(() => {
        updateCycleRef.current = false;
        storeUpdateInProgressRef.current = false;
      }, 300);
    }
  }, [strategyStore]);

  // Check if nodes have actually changed
  const shouldUpdateNodes = useCallback((newNodes: Node[], prevNodes: Node[]) => {
    return !deepEqual(newNodes, prevNodes);
  }, []);

  return {
    lastUpdateTimeRef,
    updateTimeoutRef,
    updateCycleRef,
    isProcessingChangesRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    shouldUpdateNodes
  };
}
