
import { useCallback, useRef, useMemo } from 'react';

/**
 * Hook to create a custom onNodesChange handler with processing prevention
 */
export function useCustomNodesChange(onNodesChangeWithDragDetection, onNodesChange) {
  const isProcessingChangesRef = useRef(false);
  const lastProcessedTimeRef = useRef(0);

  // Enhanced node change handler with improved drag detection and throttling
  const customNodesChangeHandler = useCallback((changes) => {
    // Skip updates during processing or if too frequent (throttling)
    const now = Date.now();
    if (isProcessingChangesRef.current || now - lastProcessedTimeRef.current < 30) return;
    
    isProcessingChangesRef.current = true;
    lastProcessedTimeRef.current = now;
    
    try {
      onNodesChangeWithDragDetection(changes, onNodesChange);
    } finally {
      // Reset processing flag after a short delay to avoid immediate re-entry
      // Using a shorter timeout to improve responsiveness while still preventing loops
      setTimeout(() => {
        isProcessingChangesRef.current = false;
      }, 30);
    }
  }, [onNodesChangeWithDragDetection, onNodesChange]);

  // Return stable objects to prevent reference changes
  return useMemo(() => ({
    customNodesChangeHandler,
    isProcessingChangesRef
  }), [customNodesChangeHandler]);
}
