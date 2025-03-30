
import React, { useCallback, useRef, useMemo, useEffect } from 'react';

/**
 * Hook to create a custom onNodesChange handler with processing prevention
 * Optimized for better performance
 */
export function useCustomNodesChange(onNodesChangeWithDragDetection, onNodesChange) {
  const isProcessingChangesRef = useRef(false);
  const lastProcessedTimeRef = useRef(0);
  const pendingChangesRef = useRef(null);
  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enhanced node change handler with improved throttling
  const customNodesChangeHandler = useCallback((changes) => {
    // Skip updates during processing
    if (isProcessingChangesRef.current) {
      // Store pending changes and process them later
      pendingChangesRef.current = changes;
      return;
    }
    
    // Apply stronger throttling - limit processing frequency
    const now = Date.now();
    if (now - lastProcessedTimeRef.current < 250) {
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
        }, 250);
      }
      
      return;
    }
    
    isProcessingChangesRef.current = true;
    lastProcessedTimeRef.current = now;
    
    try {
      onNodesChangeWithDragDetection(changes, onNodesChange);
    } finally {
      // Reset processing flag after a slightly longer delay to prevent immediate re-entry
      setTimeout(() => {
        isProcessingChangesRef.current = false;
        
        // Process any pending changes
        if (pendingChangesRef.current) {
          const pendingChanges = pendingChangesRef.current;
          pendingChangesRef.current = null;
          customNodesChangeHandler(pendingChanges);
        }
      }, 100);
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
