
import React, { useCallback, useRef, useMemo, useEffect } from 'react';

/**
 * Hook to manage drag detection and state
 * Optimized for better performance
 */
export function useDragDetection() {
  const isDraggingRef = useRef(false);
  const pendingNodesUpdate = useRef<any[] | null>(null);
  const lastDragEndTimeRef = useRef(0);
  const dragUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartPositionsRef = useRef<Map<string, {x: number, y: number}>>(new Map());

  // Enhanced node change handler with improved drag detection and throttling
  const onNodesChangeWithDragDetection = useCallback((changes, onNodesChange, updateHandler) => {
    // Apply the changes to nodes immediately for UI responsiveness
    onNodesChange(changes);
    
    // Find any position changes to track dragging
    const positionChanges = changes.filter(change => 
      change.type === 'position'
    );
    
    // Skip processing if there are no position changes
    if (positionChanges.length === 0) return;
    
    const dragStart = positionChanges.find(change => change.dragging === true);
    const dragEnd = positionChanges.find(change => change.dragging === false);
    
    if (dragStart) {
      // Drag started or continuing
      if (!isDraggingRef.current) {
        // This is the start of a new drag operation
        isDraggingRef.current = true;
        
        // Record starting positions for all nodes being dragged
        positionChanges.forEach(change => {
          if (change.position) {
            dragStartPositionsRef.current.set(change.id, {
              x: change.position.x,
              y: change.position.y
            });
          }
        });
      }
    } else if (dragEnd && isDraggingRef.current) {
      // Drag ended
      isDraggingRef.current = false;
      const now = Date.now();
      
      // Avoid processing drag end events too close together - increased timeframe
      if (now - lastDragEndTimeRef.current > 500) {
        lastDragEndTimeRef.current = now;
        
        // Clean up the timeout if one exists
        if (dragUpdateTimeoutRef.current !== null) {
          clearTimeout(dragUpdateTimeoutRef.current);
          dragUpdateTimeoutRef.current = null;
        }
        
        // Only update if we have pending updates
        if (pendingNodesUpdate.current) {
          // Apply the pending update once the drag is complete
          const nodesToUpdate = [...pendingNodesUpdate.current];
          pendingNodesUpdate.current = null;
          
          // Introduce a longer delay to avoid immediate updates
          dragUpdateTimeoutRef.current = setTimeout(() => {
            updateHandler(nodesToUpdate);
            dragUpdateTimeoutRef.current = null;
          }, 1000); // Increased delay for better stability
        }
        
        // Clear the start positions map
        dragStartPositionsRef.current.clear();
      }
    }
  }, []);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (dragUpdateTimeoutRef.current !== null) {
        clearTimeout(dragUpdateTimeoutRef.current);
        dragUpdateTimeoutRef.current = null;
      }
    };
  }, []);

  // Return stable object references to prevent re-renders
  return useMemo(() => ({
    isDraggingRef,
    pendingNodesUpdate,
    onNodesChangeWithDragDetection
  }), [onNodesChangeWithDragDetection]);
}
