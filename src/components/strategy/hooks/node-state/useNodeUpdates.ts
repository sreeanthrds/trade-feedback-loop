
import { useCallback, useRef, useMemo } from 'react';
import { Node } from '@xyflow/react';
import { deepEqual } from '../../utils/deepEqual';

/**
 * Hook to manage throttled node updates and prevent update cycles
 * Enhanced with better error handling, logging and performance optimizations
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
  const lastProcessedStoreUpdateRef = useRef(0);
  
  // Process store updates with throttling and debouncing
  const processStoreUpdate = useCallback((newNodes: Node[]) => {
    // Skip if we're in an update cycle or other updates are in progress
    if (updateCycleRef.current || storeUpdateInProgressRef.current || skipNextUpdateRef.current) {
      console.log('Skipping update - cycle or update in progress');
      return;
    }
    
    // Skip if we recently processed an update
    const now = Date.now();
    if (now - lastProcessedStoreUpdateRef.current < 1000) {
      console.log('Skipping update - too soon after previous update');
      // Queue the update for later
      pendingProcessTimeoutRef.current = window.setTimeout(() => {
        processStoreUpdate(newNodes);
      }, 1000);
      return;
    }
    
    // Validate nodes before attempting to update
    if (!newNodes || !Array.isArray(newNodes)) {
      console.error('Invalid nodes provided to processStoreUpdate:', newNodes);
      return;
    }
    
    updateCycleRef.current = true;
    storeUpdateInProgressRef.current = true;
    lastProcessedStoreUpdateRef.current = now;
    
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
      }, 200);
      
    } catch (error) {
      // Handle errors during store update with improved logging
      handleError(error, 'update store');
    } finally {
      // Reset flags after a delay to prevent immediate re-entry
      setTimeout(() => {
        updateCycleRef.current = false;
        storeUpdateInProgressRef.current = false;
        console.log('Update cycle completed, flags reset');
      }, 500);
      
      // Set a brief skip period to avoid rapid double-updates
      skipNextUpdateRef.current = true;
      setTimeout(() => {
        skipNextUpdateRef.current = false;
      }, 300);
    }
  }, [strategyStore]);

  // For handling pending updates
  const pendingProcessTimeoutRef = useRef<number | null>(null);
  
  // Cleanup effect for the pending timeout
  React.useEffect(() => {
    return () => {
      if (pendingProcessTimeoutRef.current) {
        clearTimeout(pendingProcessTimeoutRef.current);
        pendingProcessTimeoutRef.current = null;
      }
    };
  }, []);

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

  // Optimized version to check if nodes have actually changed
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
      
      // Quick check on first few nodes before deep equal
      // This can avoid expensive deep comparison in many cases
      const quickCheckCount = Math.min(3, newNodes.length);
      for (let i = 0; i < quickCheckCount; i++) {
        const newNode = newNodes[i];
        const prevNode = prevNodes[i];
        
        if (newNode.id !== prevNode.id || 
            newNode.position.x !== prevNode.position.x || 
            newNode.position.y !== prevNode.position.y) {
          console.log('Node changed based on quick comparison');
          return true;
        }
      }
      
      // Only do deep comparison when necessary - use a sampled approach for large node sets
      if (newNodes.length > 10) {
        // For large sets, sample a few nodes for comparison
        const sampleSize = Math.max(3, Math.floor(newNodes.length * 0.3));
        const sampleIndices = new Set();
        
        // Get random sample indices
        while (sampleIndices.size < sampleSize) {
          sampleIndices.add(Math.floor(Math.random() * newNodes.length));
        }
        
        // Check sampled nodes
        for (const index of sampleIndices) {
          if (!deepEqual(newNodes[index], prevNodes[index])) {
            console.log('Nodes changed based on sampled deep comparison');
            return true;
          }
        }
        
        console.log('Nodes likely unchanged (sampled check)');
        return false;
      }
      
      // For smaller sets, do full deep comparison
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
