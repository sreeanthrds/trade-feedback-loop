
import { useCallback, useRef } from 'react';
import { Node } from '@xyflow/react';
import { handleError } from '../../utils/errorHandling';

/**
 * Hook to manage node updates to the store with improved throttling and batching
 */
export function useNodeUpdateStore(strategyStore: any) {
  const lastUpdateTimeRef = useRef(0);
  const updateCycleRef = useRef(false);
  const storeUpdateInProgressRef = useRef(false);
  const skipNextUpdateRef = useRef(false);
  const nodeHashRef = useRef<string>('');
  const pendingUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const batchedNodesRef = useRef<Node[] | null>(null);
  
  // Generate a more efficient hash of nodes to detect actual changes
  const generateNodesHash = (nodes: Node[]): string => {
    if (!nodes || !Array.isArray(nodes)) return '';
    try {
      // Use fixed sampling to make hash calculation O(1) rather than O(n)
      const MAX_SAMPLES = 5;
      const samples = [];
      
      // Add first and last nodes for better detection of array changes
      if (nodes.length > 0) {
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        
        samples.push(first.id, first.position.x, first.position.y);
        samples.push(last.id, last.position.x, last.position.y);
      }
      
      // Add node count for quick change detection
      samples.push(nodes.length);
      
      // Add a random middle node if available
      if (nodes.length > 2) {
        const mid = nodes[Math.floor(nodes.length / 2)];
        samples.push(mid.id, mid.position.x, mid.position.y);
      }
      
      return samples.join(':');
    } catch (error) {
      return Math.random().toString(); // Fallback to ensure update happens
    }
  };
  
  // Process store updates with throttling, debouncing and batching
  const processStoreUpdate = useCallback((newNodes: Node[]) => {
    // Skip if we're in an update cycle or other updates are in progress
    if (updateCycleRef.current || storeUpdateInProgressRef.current || skipNextUpdateRef.current) {
      // Batch the update for later processing
      batchedNodesRef.current = newNodes;
      return;
    }
    
    // Validate nodes before attempting to update
    if (!newNodes || !Array.isArray(newNodes)) {
      return;
    }
    
    // Skip if we recently processed an update
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 5000) { // Much longer throttle to reduce frequency
      // Queue the update to happen later
      batchedNodesRef.current = newNodes;
      
      // Set up a timer to process the update later if not already set
      if (pendingUpdateTimerRef.current === null) {
        pendingUpdateTimerRef.current = setTimeout(() => {
          if (batchedNodesRef.current) {
            processStoreUpdate(batchedNodesRef.current);
            batchedNodesRef.current = null;
          }
          pendingUpdateTimerRef.current = null;
        }, 5000 - (now - lastUpdateTimeRef.current)); // Schedule to run when throttle period ends
      }
      
      return;
    }
    
    // Check if nodes have actually changed using our simple hash function
    const newHash = generateNodesHash(newNodes);
    if (newHash === nodeHashRef.current) {
      return;
    }
    
    updateCycleRef.current = true;
    storeUpdateInProgressRef.current = true;
    lastUpdateTimeRef.current = now;
    nodeHashRef.current = newHash;
    
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
      }, 1000);
      
    } catch (error) {
      handleError(error, 'processStoreUpdate');
    } finally {
      // Reset flags after a delay to prevent immediate re-entry
      setTimeout(() => {
        updateCycleRef.current = false;
        storeUpdateInProgressRef.current = false;
        
        // Process any batched updates that came in while we were updating
        if (batchedNodesRef.current) {
          const batchedNodes = batchedNodesRef.current;
          batchedNodesRef.current = null;
          
          // Wait a bit before processing the batched update
          setTimeout(() => {
            processStoreUpdate(batchedNodes);
          }, 1000);
        }
      }, 3000); // Much longer delay to reduce update frequency
      
      // Set a brief skip period to avoid rapid double-updates
      skipNextUpdateRef.current = true;
      setTimeout(() => {
        skipNextUpdateRef.current = false;
      }, 2000);
    }
  }, [strategyStore]);

  // Cleanup function for any pending timers
  const cleanup = useCallback(() => {
    if (pendingUpdateTimerRef.current !== null) {
      clearTimeout(pendingUpdateTimerRef.current);
      pendingUpdateTimerRef.current = null;
    }
  }, []);

  return {
    lastUpdateTimeRef,
    updateCycleRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    cleanup
  };
}
