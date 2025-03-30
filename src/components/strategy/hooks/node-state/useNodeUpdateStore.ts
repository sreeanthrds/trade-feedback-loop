
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
  const nodeHashRef = useRef<string>('');
  
  // Generate a simple hash of nodes to detect actual changes
  const generateNodesHash = (nodes: Node[]): string => {
    if (!nodes || !Array.isArray(nodes)) return '';
    try {
      // Sample a subset of nodes for faster comparison
      const sampleSize = Math.min(5, nodes.length);
      const nodeSamples = [];
      
      for (let i = 0; i < sampleSize; i++) {
        const idx = Math.floor(i * (nodes.length / sampleSize));
        const node = nodes[idx];
        if (!node) continue;
        
        nodeSamples.push({
          id: node.id,
          type: node.type,
          position: node.position,
          // Only include small parts of data for hash
          label: node.data?.label,
          conditionCount: Array.isArray(node.data?.conditions) ? node.data.conditions.length : 0
        });
      }
      
      return JSON.stringify(nodeSamples);
    } catch (error) {
      return Math.random().toString(); // Fallback to ensure update happens
    }
  };
  
  // Process store updates with throttling and debouncing - heavily optimized
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
    if (now - lastUpdateTimeRef.current < 3000) {
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
      }, 2000);
      
      // Set a brief skip period to avoid rapid double-updates
      skipNextUpdateRef.current = true;
      setTimeout(() => {
        skipNextUpdateRef.current = false;
      }, 1000);
    }
  }, [strategyStore]);

  return {
    lastUpdateTimeRef,
    updateCycleRef,
    storeUpdateInProgressRef,
    processStoreUpdate
  };
}
