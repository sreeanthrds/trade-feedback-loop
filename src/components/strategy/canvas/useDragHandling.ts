import { useCallback, useRef, useMemo, useEffect } from 'react';
import { Node } from '@xyflow/react';

export function useDragHandling() {
  const isNodeDraggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);
  const dragNodesRef = useRef<Set<string>>(new Set());
  const dragThrottleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Clean up timeouts when unmounting
  useEffect(() => {
    return () => {
      if (dragThrottleTimeoutRef.current) {
        clearTimeout(dragThrottleTimeoutRef.current);
        dragThrottleTimeoutRef.current = null;
      }
    };
  }, []);

  const handleBeforeDrag = useCallback(() => {
    if (!isNodeDraggingRef.current) {
      isNodeDraggingRef.current = true;
      dragStartTimeRef.current = Date.now();
      dragNodesRef.current.clear();
    }
  }, []);

  const handleDragStop = useCallback(() => {
    // Only reset dragging state after a small delay to avoid flickering
    // during quick drag operations
    if (dragThrottleTimeoutRef.current) {
      clearTimeout(dragThrottleTimeoutRef.current);
    }
    
    dragThrottleTimeoutRef.current = setTimeout(() => {
      isNodeDraggingRef.current = false;
      dragNodesRef.current.clear();
      dragThrottleTimeoutRef.current = null;
    }, 500); // Wait a bit before considering drag truly complete
  }, []);

  // Enhanced nodes change handler with improved drag detection
  const handleNodesChange = useCallback((changes, onNodesChange) => {
    // Early return if changes is empty
    if (!changes || changes.length === 0) {
      return onNodesChange(changes);
    }
    
    // Detect start of dragging
    const dragStart = changes.find(change => 
      change.type === 'position' && change.dragging === true
    );
    
    if (dragStart) {
      handleBeforeDrag();
      // Track which nodes are being dragged
      changes.forEach(change => {
        if (change.type === 'position' && change.id) {
          dragNodesRef.current.add(change.id);
        }
      });
    }
    
    // Always apply changes to keep UI responsive
    onNodesChange(changes);
    
    // Detect end of dragging
    const dragEnd = changes.find(change => 
      change.type === 'position' && 
      change.dragging === false &&
      dragNodesRef.current.has(change.id)
    );
    
    if (dragEnd && isNodeDraggingRef.current) {
      handleDragStop();
    }
  }, [handleBeforeDrag, handleDragStop]);

  return useMemo(() => ({
    isNodeDraggingRef,
    handleNodesChange,
    dragNodesRef
  }), [handleNodesChange]);
}
