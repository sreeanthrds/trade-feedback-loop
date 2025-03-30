
import { useCallback, useRef, useMemo } from 'react';

/**
 * Hook to manage drag detection and state
 * Enhanced with better performance optimizations
 */
export function useDragDetection() {
  const isDraggingRef = useRef(false);
  const pendingNodesUpdate = useRef<any[] | null>(null);
  const lastDragEndTimeRef = useRef(0);
  const dragUpdateTimeoutRef = useRef<number | null>(null);
  const dragStartPositionsRef = useRef<Map<string, {x: number, y: number}>>(new Map());

  // Enhanced node change handler with improved drag detection
  const onNodesChangeWithDragDetection = useCallback((changes, onNodesChange, updateHandler) => {
    // Apply the changes to nodes immediately for UI responsiveness
    onNodesChange(changes);
    
    // First, find any position changes to track dragging
    const positionChanges = changes.filter(change => 
      change.type === 'position'
    );
    
    // Process drag operations
    if (positionChanges.length > 0) {
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
        
        // Avoid processing drag end events too close together
        if (now - lastDragEndTimeRef.current > 300) {
          lastDragEndTimeRef.current = now;
          
          // Clean up the timeout if one exists
          if (dragUpdateTimeoutRef.current !== null) {
            clearTimeout(dragUpdateTimeoutRef.current);
            dragUpdateTimeoutRef.current = null;
          }
          
          // Check if we had significant movement
          let significantMovement = false;
          
          for (const change of positionChanges) {
            const startPos = dragStartPositionsRef.current.get(change.id);
            if (startPos && change.position) {
              const dx = Math.abs(change.position.x - startPos.x);
              const dy = Math.abs(change.position.y - startPos.y);
              
              // Only consider it significant if moved more than 5 pixels
              if (dx > 5 || dy > 5) {
                significantMovement = true;
                break;
              }
            }
          }
          
          // Only update if we had significant movement or have pending updates
          if (significantMovement && pendingNodesUpdate.current) {
            // Apply the pending update once the drag is complete
            const nodesToUpdate = [...pendingNodesUpdate.current];
            pendingNodesUpdate.current = null;
            
            // Introduce a delay to avoid immediate updates
            dragUpdateTimeoutRef.current = window.setTimeout(() => {
              updateHandler(nodesToUpdate);
              dragUpdateTimeoutRef.current = null;
            }, 500); // Increased delay for better stability
          }
          
          // Clear the start positions map
          dragStartPositionsRef.current.clear();
        }
      }
    }
  }, []);

  // Clean up timeouts
  React.useEffect(() => {
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
