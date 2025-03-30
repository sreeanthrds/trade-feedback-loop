
import { useCallback, useRef } from 'react';

/**
 * Hook to manage drag detection and state
 */
export function useDragDetection() {
  const isDraggingRef = useRef(false);
  const pendingNodesUpdate = useRef<any[] | null>(null);

  // Enhanced node change handler with improved drag detection
  const onNodesChangeWithDragDetection = useCallback((changes, onNodesChange, updateHandler) => {
    // Apply the changes to nodes immediately for UI responsiveness
    onNodesChange(changes);
    
    // Detect drag operations
    const dragChange = changes.find(change => 
      change.type === 'position' && change.dragging !== undefined
    );
    
    if (dragChange) {
      if (dragChange.dragging) {
        // Drag started or continuing
        isDraggingRef.current = true;
      } else if (isDraggingRef.current) {
        // Drag ended
        isDraggingRef.current = false;
        
        // Apply the pending update once the drag is complete
        if (pendingNodesUpdate.current) {
          // Use setTimeout to break the React update cycle
          const nodesToUpdate = [...pendingNodesUpdate.current];
          pendingNodesUpdate.current = null;
          
          // Introduce a delay to avoid immediate updates
          setTimeout(() => {
            updateHandler(nodesToUpdate);
          }, 300);
        }
      }
    }
  }, []);

  return {
    isDraggingRef,
    pendingNodesUpdate,
    onNodesChangeWithDragDetection
  };
}
