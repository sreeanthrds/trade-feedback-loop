
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
  const historyUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
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
        
        if (first && first.position) {
          samples.push(first.id, Math.round(first.position.x), Math.round(first.position.y));
        }
        
        if (last && last.position) {
          samples.push(last.id, Math.round(last.position.x), Math.round(last.position.y));
        }
      }
      
      // Add node count for quick change detection
      samples.push(nodes.length);
      
      // Add a random middle node if available
      if (nodes.length > 2) {
        const mid = nodes[Math.floor(nodes.length / 2)];
        if (mid && mid.position) {
          samples.push(mid.id, Math.round(mid.position.x), Math.round(mid.position.y));
        }
      }
      
      return samples.join(':');
    } catch (error) {
      console.error('Error generating node hash:', error);
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
      console.warn('Invalid nodes provided to processStoreUpdate');
      return;
    }
    
    // Check if nodes have actually changed using our simple hash function
    const newHash = generateNodesHash(newNodes);
    if (newHash === nodeHashRef.current) {
      // Skip update if the nodes haven't meaningfully changed
      return;
    }
    
    // Skip if we recently processed an update
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 1000) { // Reduced from 8000ms to 1000ms to avoid long delays
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
        }, 1000); // Schedule to run after a shorter delay
      }
      
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
      if (historyUpdateTimerRef.current) {
        clearTimeout(historyUpdateTimerRef.current);
      }
      
      historyUpdateTimerRef.current = setTimeout(() => {
        try {
          strategyStore.addHistoryItem(newNodes, strategyStore.edges);
          historyUpdateTimerRef.current = null;
        } catch (historyError) {
          handleError(historyError, 'addHistoryItem');
        }
      }, 500); // Reduced from 2000ms to 500ms
      
    } catch (error) {
      handleError(error, 'processStoreUpdate');
    } finally {
      // Reset flags after a short delay to prevent immediate re-entry
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
          }, 500); // Reduced from 3000ms to 500ms
        }
      }, 500); // Reduced from 5000ms to 500ms
      
      // Set a brief skip period to avoid rapid double-updates
      skipNextUpdateRef.current = true;
      setTimeout(() => {
        skipNextUpdateRef.current = false;
      }, 500); // Reduced from 3000ms to 500ms
    }
  }, [strategyStore]);

  // Cleanup function for any pending timers
  const cleanup = useCallback(() => {
    if (pendingUpdateTimerRef.current !== null) {
      clearTimeout(pendingUpdateTimerRef.current);
      pendingUpdateTimerRef.current = null;
    }
    
    if (historyUpdateTimerRef.current !== null) {
      clearTimeout(historyUpdateTimerRef.current);
      historyUpdateTimerRef.current = null;
    }
    
    updateCycleRef.current = false;
    storeUpdateInProgressRef.current = false;
    skipNextUpdateRef.current = false;
  }, []);

  return {
    lastUpdateTimeRef,
    updateCycleRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    cleanup
  };
}
