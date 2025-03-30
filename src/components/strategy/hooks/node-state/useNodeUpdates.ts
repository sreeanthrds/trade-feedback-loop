
import { useCallback, useRef, useMemo } from 'react';
import { Node } from '@xyflow/react';
import { deepEqual } from '../../utils/deepEqual';

/**
 * Hook to manage throttled node updates and prevent update cycles
 * Enhanced with better error handling and logging
 */
export function useNodeUpdates(strategyStore: any) {
  const lastUpdateTimeRef = useRef(0);
  const updateTimeoutRef = useRef<number | null>(null);
  const updateCycleRef = useRef(false);
  const isProcessingChangesRef = useRef(false);
  const storeUpdateInProgressRef = useRef(false);
  const skipNextUpdateRef = useRef(false);
  const errorCountRef = useRef(0);
  const lastErrorTimeRef = useRef(0);
  
  // Process store updates with throttling and debouncing
  const processStoreUpdate = useCallback((newNodes: Node[]) => {
    // Skip if we're in an update cycle or other updates are in progress
    if (updateCycleRef.current || storeUpdateInProgressRef.current || skipNextUpdateRef.current) {
      console.log('Skipping update - cycle or update in progress');
      return;
    }
    
    // Validate nodes before attempting to update
    if (!newNodes || !Array.isArray(newNodes)) {
      console.error('Invalid nodes provided to processStoreUpdate:', newNodes);
      return;
    }
    
    updateCycleRef.current = true;
    storeUpdateInProgressRef.current = true;
    
    try {
      console.log(`Processing store update with ${newNodes.length} nodes`);
      
      // Update the store with the new nodes
      strategyStore.setNodes(newNodes);
      
      // Delay adding history to allow for batching of related changes
      setTimeout(() => {
        try {
          strategyStore.addHistoryItem(newNodes, strategyStore.edges);
          console.log('History item added successfully');
        } catch (historyError) {
          console.error('Error adding history item:', historyError);
          // Track error frequency to avoid flooding
          handleError(historyError, 'add history');
        }
      }, 100);
      
    } catch (error) {
      // Handle errors during store update with improved logging
      handleError(error, 'update store');
    } finally {
      // Reset flags after a delay to prevent immediate re-entry
      setTimeout(() => {
        updateCycleRef.current = false;
        storeUpdateInProgressRef.current = false;
        console.log('Update cycle completed, flags reset');
      }, 300);
      
      // Set a brief skip period to avoid rapid double-updates
      skipNextUpdateRef.current = true;
      setTimeout(() => {
        skipNextUpdateRef.current = false;
      }, 150);
    }
  }, [strategyStore]);

  // Error handling with rate limiting to prevent console flooding
  const handleError = useCallback((error: any, operation: string) => {
    const now = Date.now();
    
    // Reset error count if it's been more than 10 seconds since last error
    if (now - lastErrorTimeRef.current > 10000) {
      errorCountRef.current = 0;
    }
    
    errorCountRef.current++;
    lastErrorTimeRef.current = now;
    
    // Full logging for first few errors, then throttle
    if (errorCountRef.current <= 3) {
      console.error(`Error during ${operation} operation:`, error);
      console.trace('Stack trace:');
    } else if (errorCountRef.current % 10 === 0) {
      // Log less frequently after initial errors
      console.warn(`Multiple errors during ${operation} (${errorCountRef.current} total). Latest:`, error.message);
    }
    
    // Try to recover from error state
    setTimeout(() => {
      if (updateCycleRef.current || storeUpdateInProgressRef.current) {
        console.log('Forcing recovery from error state');
        updateCycleRef.current = false;
        storeUpdateInProgressRef.current = false;
      }
    }, 1000);
  }, []);

  // Check if nodes have actually changed - memoize this function
  const shouldUpdateNodes = useCallback((newNodes: Node[], prevNodes: Node[]) => {
    try {
      // Validate inputs
      if (!newNodes || !prevNodes) {
        console.warn('Invalid nodes comparison:', { newNodes, prevNodes });
        return false;
      }
      
      // Quick equality check first to avoid deep comparison
      if (newNodes === prevNodes) {
        console.log('Node reference unchanged, skipping update');
        return false;
      }
      
      // Length check before deep equality for performance
      if (newNodes.length !== prevNodes.length) {
        console.log(`Node count changed: ${prevNodes.length} -> ${newNodes.length}`);
        return true;
      }
      
      // Only do deep comparison when necessary
      const areEqual = deepEqual(newNodes, prevNodes);
      if (!areEqual) {
        console.log('Nodes changed structurally, update needed');
      }
      return !areEqual;
    } catch (error) {
      console.error('Error in shouldUpdateNodes comparison:', error);
      // In case of error, return true to be safe (allow update)
      return true;
    }
  }, []);

  // Return stable references to prevent re-renders
  return useMemo(() => ({
    lastUpdateTimeRef,
    updateTimeoutRef,
    updateCycleRef,
    isProcessingChangesRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    shouldUpdateNodes,
    handleError
  }), [processStoreUpdate, shouldUpdateNodes, handleError]);
}
