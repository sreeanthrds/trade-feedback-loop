
import { useCallback, useRef } from 'react';

export function useDragHandling() {
  const isNodeDraggingRef = useRef(false);
  
  const handleBeforeDrag = useCallback(() => {
    isNodeDraggingRef.current = true;
  }, []);

  const handleDragStop = useCallback(() => {
    isNodeDraggingRef.current = false;
  }, []);

  // Customize onNodesChange to track dragging
  const handleNodesChange = useCallback((changes, onNodesChange) => {
    // Detect start of dragging
    const dragStart = changes.find(change => 
      change.type === 'position' && change.dragging === true
    );
    
    if (dragStart && !isNodeDraggingRef.current) {
      handleBeforeDrag();
    }
    
    // Detect end of dragging
    const dragEnd = changes.find(change => 
      change.type === 'position' && change.dragging === false
    );
    
    if (dragEnd && isNodeDraggingRef.current) {
      handleDragStop();
    }
    
    // Pass changes to original handler
    onNodesChange(changes);
  }, []);

  return {
    isNodeDraggingRef,
    handleNodesChange
  };
}
