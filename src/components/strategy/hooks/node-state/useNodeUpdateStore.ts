
import { useCallback, useRef } from 'react';
import { Node } from '@xyflow/react';
import { handleError } from '../../utils/errorHandling';

/**
 * Hook to manage node updates to the store with throttling
 */
export function useNodeUpdateStore(strategyStore: any) {
  const lastUpdateTimeRef = useRef(0);
  const updateCycleRef = useRef(false);
  const storeUpdateInProgressRef = useRef(false);
  const skipNextUpdateRef = useRef(false);
  
  // Process store updates with throttling and debouncing - optimized
  const processStoreUpdate = useCallback((newNodes: Node[]) => {
    // Skip if we're in an update cycle or other updates are in progress
    if (updateCycleRef.current || storeUpdateInProgressRef.current || skipNextUpdateRef.current) {
      return;
    }
    
    // Validate nodes before attempting to update
    if (!newNodes || !Array.isArray(newNodes)) {
      return;
    }
    
    // Skip if we recently processed an update
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 2000) {
      return;
    }
    
    updateCycleRef.current = true;
    storeUpdateInProgressRef.current = true;
    lastUpdateTimeRef.current = now;
    
    try {
      // Update the store with the new nodes
      strategyStore.setNodes(newNodes);
      
      // Delay adding history to allow for batching of related changes
      setTimeout(() => {
        try {
          strategyStore.addHistoryItem(newNodes, strategyStore.edges);
        } catch (historyError) {
          handleError(historyError, 'addHistoryItem');
        }
      }, 500);
      
    } catch (error) {
      handleError(error, 'processStoreUpdate');
    } finally {
      // Reset flags after a delay to prevent immediate re-entry
      setTimeout(() => {
        updateCycleRef.current = false;
        storeUpdateInProgressRef.current = false;
      }, 1000);
      
      // Set a brief skip period to avoid rapid double-updates
      skipNextUpdateRef.current = true;
      setTimeout(() => {
        skipNextUpdateRef.current = false;
      }, 500);
    }
  }, [strategyStore]);

  return {
    lastUpdateTimeRef,
    updateCycleRef,
    storeUpdateInProgressRef,
    processStoreUpdate
  };
}
