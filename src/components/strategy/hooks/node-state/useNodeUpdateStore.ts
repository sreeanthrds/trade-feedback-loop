
import { useCallback, useRef } from 'react';
import { Node } from '@xyflow/react';
import { handleError } from '../../utils/errorHandling';

/**
 * Hook to manage node updates to the store with improved throttling and batching
 * with optimizations to prevent infinite render cycles
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
  const updateCountRef = useRef(0);
  
  // Generate a more efficient hash of nodes to detect actual changes
  const generateNodesHash = (nodes: Node[]): string => {
    if (!nodes || !Array.isArray(nodes)) return '';
    try {
      // Use fixed sampling to make hash calculation O(1) rather than O(n)
      const samples = [];
      
      // Add node count for quick change detection
      samples.push(nodes.length);
      
      // Sample up to 3 nodes for faster hash calculation
      const sampleIndices = [0, Math.floor(nodes.length / 2), nodes.length - 1];
      
      for (const index of sampleIndices) {
        if (index >= 0 && index < nodes.length) {
          const node = nodes[index];
          if (node && node.id) {
            samples.push(node.id);
            if (node.position) {
              samples.push(Math.round(node.position.x), Math.round(node.position.y));
            }
            if (node.data && node.data._lastUpdated) {
              samples.push(node.data._lastUpdated);
            }
          }
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
    
    // Track update count to detect potential infinite loops
    updateCountRef.current++;
    if (updateCountRef.current > 50) {
      console.warn('Too many updates detected, breaking potential infinite loop');
      updateCycleRef.current = true;
      
      // Reset after a delay
      setTimeout(() => {
        updateCycleRef.current = false;
        updateCountRef.current = 0;
      }, 1000);
      
      return;
    }
    
    // Reset update count every 3 seconds
    if (Date.now() - lastUpdateTimeRef.current > 3000) {
      updateCountRef.current = 0;
    }
    
    // Validate nodes before attempting to update
    if (!newNodes || !Array.isArray(newNodes)) {
      console.warn('Invalid nodes provided to processStoreUpdate');
      return;
    }
    
    // Check if nodes have actually changed using our simple hash function
    const newHash = generateNodesHash(newNodes);
    if (newHash === nodeHashRef.current && nodeHashRef.current !== '') {
      // Skip update if the nodes haven't meaningfully changed
      return;
    }
    
    // Skip if we recently processed an update
    const now = Date.now();
    if (now - lastUpdateTimeRef.current < 200) { // Reduced from 1000ms to 200ms
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
        }, 250); // Schedule to run after a shorter delay
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
      }, 300); // Reduced from 500ms to 300ms
      
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
          }, 300); // Reduced from 500ms to 300ms
        }
      }, 250); // Reduced from 500ms to 250ms
      
      // Set a brief skip period to avoid rapid double-updates
      skipNextUpdateRef.current = true;
      setTimeout(() => {
        skipNextUpdateRef.current = false;
      }, 150); // Reduced from 500ms to 150ms
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
    updateCountRef.current = 0;
  }, []);

  return {
    lastUpdateTimeRef,
    updateCycleRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    cleanup
  };
}
