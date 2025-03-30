
import { useCallback, useRef, useMemo } from 'react';
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
  const skipNextUpdateRef = useRef(false);
  
  // Process store updates with throttling and debouncing
  const processStoreUpdate = useCallback((newNodes: Node[]) => {
    if (updateCycleRef.current || storeUpdateInProgressRef.current || skipNextUpdateRef.current) {
      return;
    }
    
    updateCycleRef.current = true;
    storeUpdateInProgressRef.current = true;
    
    try {
      strategyStore.setNodes(newNodes);
      
      // Delay adding history to allow for batching of related changes
      setTimeout(() => {
        strategyStore.addHistoryItem(newNodes, strategyStore.edges);
      }, 100);
    } catch (error) {
      console.error('Error updating store after drag:', error);
    } finally {
      // Reset flags after a delay to prevent immediate re-entry
      setTimeout(() => {
        updateCycleRef.current = false;
        storeUpdateInProgressRef.current = false;
      }, 300);
      
      // Set a brief skip period to avoid rapid double-updates
      skipNextUpdateRef.current = true;
      setTimeout(() => {
        skipNextUpdateRef.current = false;
      }, 150);
    }
  }, [strategyStore]);

  // Check if nodes have actually changed - memoize this function
  const shouldUpdateNodes = useCallback((newNodes: Node[], prevNodes: Node[]) => {
    // Quick equality check first to avoid deep comparison
    if (newNodes === prevNodes) return false;
    
    // Length check before deep equality for performance
    if (newNodes.length !== prevNodes.length) return true;
    
    // Only do deep comparison when necessary
    return !deepEqual(newNodes, prevNodes);
  }, []);

  // Return stable references to prevent re-renders
  return useMemo(() => ({
    lastUpdateTimeRef,
    updateTimeoutRef,
    updateCycleRef,
    isProcessingChangesRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    shouldUpdateNodes
  }), [processStoreUpdate, shouldUpdateNodes]);
}
