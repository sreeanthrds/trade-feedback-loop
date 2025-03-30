
import { useCallback, useRef, useMemo, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { fastNodesComparison } from '../../utils/performanceUtils';

/**
 * Hook to manage throttled node updates and prevent update cycles
 * Optimized for better performance with large node sets
 */
export function useNodeUpdates(strategyStore: any) {
  const lastUpdateTimeRef = useRef(0);
  const updateTimeoutRef = useRef<number | null>(null);
  const updateCycleRef = useRef(false);
  const isProcessingChangesRef = useRef(false);
  const storeUpdateInProgressRef = useRef(false);
  const skipNextUpdateRef = useRef(false);
  const pendingProcessTimeoutRef = useRef<number | null>(null);
  
  // Process store updates with throttling and debouncing - optimized
  const processStoreUpdate = useCallback((newNodes: Node[]) => {
    // Skip if we're in an update cycle or other updates are in progress
    if (updateCycleRef.current || storeUpdateInProgressRef.current || skipNextUpdateRef.current) {
      return;
    }
    
    // Skip if we recently processed an update - increased delay for better performance
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 2000) {
      // Queue the update for later with a longer delay
      if (pendingProcessTimeoutRef.current) {
        window.clearTimeout(pendingProcessTimeoutRef.current);
      }
      
      pendingProcessTimeoutRef.current = window.setTimeout(() => {
        pendingProcessTimeoutRef.current = null;
        processStoreUpdate(newNodes);
      }, 2000);
      return;
    }
    
    // Validate nodes before attempting to update
    if (!newNodes || !Array.isArray(newNodes)) {
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
          console.error('Error adding history item:', historyError);
        }
      }, 500);
      
    } catch (error) {
      console.error('Error updating store:', error);
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

  // Cleanup effect for the pending timeout
  useEffect(() => {
    return () => {
      if (pendingProcessTimeoutRef.current) {
        clearTimeout(pendingProcessTimeoutRef.current);
        pendingProcessTimeoutRef.current = null;
      }
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
    };
  }, []);

  // Optimized version to check if nodes have actually changed
  const shouldUpdateNodes = useCallback((newNodes: Node[], prevNodes: Node[]) => {
    try {
      // Validate inputs
      if (!newNodes || !prevNodes) {
        return false;
      }
      
      // Quick equality check first to avoid deep comparison
      if (newNodes === prevNodes) {
        return false;
      }
      
      // Length check before deep equality for performance
      if (newNodes.length !== prevNodes.length) {
        return true;
      }
      
      // Use fast comparison method instead of deep equality for better performance
      return !fastNodesComparison(newNodes, prevNodes);
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
    shouldUpdateNodes
  }), [processStoreUpdate, shouldUpdateNodes]);
}
