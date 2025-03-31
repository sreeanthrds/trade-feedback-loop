
import { useCallback, useMemo } from 'react';
import { Node } from '@xyflow/react';
import { shouldUpdateNodes } from '../../utils/performanceUtils';
import { handleError } from '../../utils/errorHandling';

interface CustomSetNodesProps {
  setLocalNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  isDraggingRef: React.MutableRefObject<boolean>;
  pendingNodesUpdate: React.MutableRefObject<Node[] | null>;
  lastUpdateTimeRef: React.MutableRefObject<number>;
  updateTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  updateCycleRef: React.MutableRefObject<boolean>;
  storeUpdateInProgressRef: React.MutableRefObject<boolean>;
  shouldUpdateNodes: (newNodes: any[], prevNodes: any[]) => boolean;
  processStoreUpdate: (nodes: Node[]) => void;
  handleError: (error: unknown, context: string) => void;
}

/**
 * Hook to create a custom setNodes function with throttling and cycle detection
 * Now with improved performance optimizations
 */
export function useCustomSetNodes({
  setLocalNodes,
  isDraggingRef,
  pendingNodesUpdate,
  lastUpdateTimeRef,
  updateTimeoutRef,
  updateCycleRef,
  storeUpdateInProgressRef,
  processStoreUpdate,
  handleError
}: CustomSetNodesProps) {
  // Track consecutive updates counter to detect potential infinite loops
  const consecutiveUpdatesRef = useMemo(() => ({ count: 0, lastUpdateTime: 0 }), []);
  
  // Track initial node operations to handle them differently
  const initialNodeOperationRef = useMemo(() => ({ done: false }), []);
  
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
        
        // Detect potential infinite update loop
        const now = Date.now();
        if (now - consecutiveUpdatesRef.lastUpdateTime < 500) {
          consecutiveUpdatesRef.count++;
          
          // If we detect too many updates in quick succession, break the cycle
          if (consecutiveUpdatesRef.count > 20) {
            console.warn('Potential infinite update cycle detected in setNodes, breaking cycle');
            consecutiveUpdatesRef.count = 0;
            return prevNodes;
          }
        } else {
          // Reset counter if enough time has passed between updates
          consecutiveUpdatesRef.count = 0;
        }
        consecutiveUpdatesRef.lastUpdateTime = now;
        
        // Special handling for node count changes (add/remove nodes)
        if (newNodes.length !== prevNodes.length) {
          console.log(`Node count changed: ${prevNodes.length} -> ${newNodes.length}`);
          
          // First node operation requires immediate update
          const isInitialOperation = !initialNodeOperationRef.done && 
            prevNodes.length <= 1 && newNodes.length > prevNodes.length;
          
          if (isInitialOperation) {
            console.log('Initial node operation detected, processing immediately');
            initialNodeOperationRef.done = true;
            
            // Force immediate update for the first node operation
            setTimeout(() => {
              processStoreUpdate(newNodes);
            }, 50);
            
            return newNodes;
          }
          
          // Handle dragging state
          if (isDraggingRef.current) {
            pendingNodesUpdate.current = newNodes;
            return newNodes;
          }
          
          // Schedule update with increased delay
          if (updateTimeoutRef.current !== null) {
            clearTimeout(updateTimeoutRef.current);
          }
          
          updateTimeoutRef.current = setTimeout(() => {
            processStoreUpdate(newNodes);
          }, 3000); // Increased from 1000ms to 3000ms
          
          return newNodes;
        }
        
        // Skip if nodes haven't actually changed using a simplified comparison
        // This avoids the expensive deep equality check in most cases
        if (!shouldUpdateNodes(newNodes, prevNodes)) {
          return prevNodes;
        }
        
        console.log(`Setting ${newNodes.length} nodes, dragging: ${isDraggingRef.current}`);
        
        // Don't update store during dragging, just queue the update
        if (isDraggingRef.current) {
          pendingNodesUpdate.current = newNodes;
          return newNodes;
        }
        
        // Throttle updates to the store during frequent operations
        const updateTime = Date.now();
        if (updateTime - lastUpdateTimeRef.current > 4000) { // Increased from 2000ms to 4000ms
          lastUpdateTimeRef.current = updateTime;
          
          // Clear any pending timeout
          if (updateTimeoutRef.current !== null) {
            clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
          }
          
          // Schedule the update to the store with setTimeout to break the React update cycle
          console.log('Scheduling delayed update to store');
          updateTimeoutRef.current = setTimeout(() => {
            processStoreUpdate(newNodes);
          }, 3000); // Increased from 1000ms to 3000ms
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
    processStoreUpdate,
    handleError,
    consecutiveUpdatesRef,
    initialNodeOperationRef
  ]);

  // Return a stable reference to prevent re-renders
  return useMemo(() => setNodes, [setNodes]);
}
