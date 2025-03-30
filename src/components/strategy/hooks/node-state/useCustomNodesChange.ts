
import { useCallback, useRef, useMemo, useEffect } from 'react';

/**
 * Hook to create a custom onNodesChange handler with processing prevention
 * Enhanced with better performance optimizations
 */
export function useCustomNodesChange(onNodesChangeWithDragDetection, onNodesChange) {
  const isProcessingChangesRef = useRef(false);
  const lastProcessedTimeRef = useRef(0);
  const pendingChangesRef = useRef(null);
  const processingTimeoutRef = useRef(null);

  // Enhanced node change handler with improved processing and debouncing
  const customNodesChangeHandler = useCallback((changes) => {
    // Skip updates during processing or if too frequent (throttling)
    const now = Date.now();
    if (isProcessingChangesRef.current) {
      // Store pending changes and process them later
      pendingChangesRef.current = changes;
      return;
    }
    
    // Apply throttling - limit processing frequency
    if (now - lastProcessedTimeRef.current < 100) {
      // Store the latest changes and process after a delay
      pendingChangesRef.current = changes;
      
      // If we don't have a timeout scheduled, schedule one
      if (!processingTimeoutRef.current) {
        processingTimeoutRef.current = setTimeout(() => {
          if (pendingChangesRef.current) {
            const pendingChanges = pendingChangesRef.current;
            pendingChangesRef.current = null;
            customNodesChangeHandler(pendingChanges);
          }
          processingTimeoutRef.current = null;
        }, 100);
      }
      
      return;
    }
    
    isProcessingChangesRef.current = true;
    lastProcessedTimeRef.current = now;
    
    try {
      onNodesChangeWithDragDetection(changes, onNodesChange);
    } finally {
      // Reset processing flag after a short delay to avoid immediate re-entry
      // Using a shorter timeout to improve responsiveness while still preventing loops
      setTimeout(() => {
        isProcessingChangesRef.current = false;
        
        // Process any pending changes
        if (pendingChangesRef.current) {
          const pendingChanges = pendingChangesRef.current;
          pendingChangesRef.current = null;
          customNodesChangeHandler(pendingChanges);
        }
      }, 50);
    }
  }, [onNodesChangeWithDragDetection, onNodesChange]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
    };
  }, []);

  // Return stable objects to prevent reference changes
  return useMemo(() => ({
    customNodesChangeHandler,
    isProcessingChangesRef
  }), [customNodesChangeHandler]);
}
