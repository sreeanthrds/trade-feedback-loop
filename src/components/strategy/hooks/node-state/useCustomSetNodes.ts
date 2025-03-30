
import { useCallback } from 'react';
import { Node } from '@xyflow/react';

/**
 * Hook to create a custom setNodes function with throttling and cycle detection
 */
export function useCustomSetNodes({
  setLocalNodes,
  isDraggingRef,
  pendingNodesUpdate,
  lastUpdateTimeRef,
  updateTimeoutRef,
  updateCycleRef,
  storeUpdateInProgressRef,
  shouldUpdateNodes,
  processStoreUpdate
}) {
  // Custom setNodes wrapper with improved throttling and cycle detection
  const setNodes = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    // If already in an update cycle, skip to prevent loops
    if (updateCycleRef.current || storeUpdateInProgressRef.current) return;
    
    // Always update local state for UI responsiveness
    setLocalNodes((prevNodes) => {
      try {
        // Handle both functional and direct updates
        const newNodes = typeof updatedNodes === 'function' 
          ? updatedNodes(prevNodes) 
          : updatedNodes;
        
        // Skip if nodes haven't actually changed using deep equality
        if (!shouldUpdateNodes(newNodes, prevNodes)) {
          return prevNodes;
        }
        
        // Don't update store during dragging
        if (isDraggingRef.current) {
          pendingNodesUpdate.current = newNodes;
          return newNodes;
        }
        
        // Throttle updates to the store during frequent operations
        const now = Date.now();
        if (now - lastUpdateTimeRef.current > 400) { // Increased throttle time
          lastUpdateTimeRef.current = now;
          
          // Clear any pending timeout
          if (updateTimeoutRef.current !== null) {
            window.clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
          }
          
          // Schedule the update to the store with setTimeout to break the React update cycle
          updateTimeoutRef.current = window.setTimeout(() => {
            processStoreUpdate(newNodes);
          }, 300); // Increased delay
        } else {
          pendingNodesUpdate.current = newNodes;
        }
        
        return newNodes;
      } catch (error) {
        console.error('Error in setNodes:', error);
        return prevNodes;
      }
    });
  }, [
    setLocalNodes, 
    isDraggingRef, 
    pendingNodesUpdate, 
    lastUpdateTimeRef, 
    updateTimeoutRef, 
    updateCycleRef, 
    storeUpdateInProgressRef,
    shouldUpdateNodes, 
    processStoreUpdate
  ]);

  return setNodes;
}
