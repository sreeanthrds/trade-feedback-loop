
import { useCallback, useRef } from 'react';

/**
 * Hook to create a custom onNodesChange handler with processing prevention
 */
export function useCustomNodesChange(onNodesChangeWithDragDetection, onNodesChange) {
  const isProcessingChangesRef = useRef(false);

  // Enhanced node change handler with improved drag detection
  const customNodesChangeHandler = useCallback((changes) => {
    // If already processing changes, avoid recursive updates
    if (isProcessingChangesRef.current) return;
    
    isProcessingChangesRef.current = true;
    
    try {
      onNodesChangeWithDragDetection(changes, onNodesChange);
    } finally {
      // Reset processing flag after a short delay to avoid immediate re-entry
      setTimeout(() => {
        isProcessingChangesRef.current = false;
      }, 50);
    }
  }, [onNodesChangeWithDragDetection, onNodesChange]);

  return {
    customNodesChangeHandler,
    isProcessingChangesRef
  };
}
