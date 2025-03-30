
import { useCallback, useMemo } from 'react';
import { Node } from '@xyflow/react';

/**
 * Hook to create a custom setNodes function with throttling and cycle detection
 * Now with improved error handling
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
  processStoreUpdate,
  handleError
}) {
  // Custom setNodes wrapper with improved throttling and cycle detection
  const setNodes = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    // If already in an update cycle, skip to prevent loops
    if (updateCycleRef.current || storeUpdateInProgressRef.current) {
      console.log('Skipping setNodes - update cycle in progress');
      return;
    }
    
    // Always update local state for UI responsiveness
    setLocalNodes((prevNodes) => {
      try {
        // Validate input
        if (!updatedNodes) {
          console.warn('Invalid updatedNodes provided to setNodes:', updatedNodes);
          return prevNodes;
        }
        
        // Handle both functional and direct updates
        const newNodes = typeof updatedNodes === 'function' 
          ? updatedNodes(prevNodes) 
          : updatedNodes;
        
        // Validate the nodes after transformation
        if (!Array.isArray(newNodes)) {
          console.error('setNodes produced non-array result:', newNodes);
          return prevNodes;
        }
        
        // Skip if nodes haven't actually changed using deep equality check
        if (!shouldUpdateNodes(newNodes, prevNodes)) {
          return prevNodes;
        }
        
        console.log(`Setting ${newNodes.length} nodes, dragging: ${isDraggingRef.current}`);
        
        // Don't update store during dragging
        if (isDraggingRef.current) {
          pendingNodesUpdate.current = newNodes;
          return newNodes;
        }
        
        // Throttle updates to the store during frequent operations
        const now = Date.now();
        if (now - lastUpdateTimeRef.current > 500) { // Increased throttle time for better performance
          lastUpdateTimeRef.current = now;
          
          // Clear any pending timeout
          if (updateTimeoutRef.current !== null) {
            window.clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
          }
          
          // Schedule the update to the store with setTimeout to break the React update cycle
          console.log('Scheduling delayed update to store');
          updateTimeoutRef.current = window.setTimeout(() => {
            processStoreUpdate(newNodes);
          }, 300);
        } else {
          console.log('Throttling update, storing for later processing');
          pendingNodesUpdate.current = newNodes;
        }
        
        return newNodes;
      } catch (error) {
        // Use our enhanced error handler
        handleError(error, 'setNodes');
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
    processStoreUpdate,
    handleError
  ]);

  // Return a stable reference to prevent re-renders
  return useMemo(() => setNodes, [setNodes]);
}
