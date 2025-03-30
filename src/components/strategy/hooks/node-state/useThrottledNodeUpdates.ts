
import { useEffect, useRef } from 'react';

/**
 * Hook to manage throttled node updates with much more aggressive throttling
 */
export function useThrottledNodeUpdates({
  pendingNodesUpdate,
  lastUpdateTimeRef,
  updateTimeoutRef,
  processStoreUpdate
}) {
  const isInitialRenderRef = useRef(true);
  const updateIntervalRef = useRef<number | null>(null);
  const lastProcessedTimeRef = useRef(0);
  const isProcessingRef = useRef(false);
  
  // Process any pending updates that were throttled - with optimized interval
  useEffect(() => {
    // Skip processing during initial mount
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      lastUpdateTimeRef.current = Date.now();
      return () => {};
    }
    
    // Use a much more efficient approach with reduced update frequency
    const processPendingUpdates = () => {
      // Skip if already processing
      if (isProcessingRef.current) {
        return;
      }
      
      const now = Date.now();
      
      // Only process pending updates if enough time has passed, we have updates,
      // and we haven't processed recently
      if (pendingNodesUpdate.current && 
          now - lastUpdateTimeRef.current > 5000 && // Much longer wait
          now - lastProcessedTimeRef.current > 5000) { // Ensure at least 5s between updates
        
        // Mark as processing to prevent concurrent processing
        isProcessingRef.current = true;
        
        try {
          lastUpdateTimeRef.current = now;
          lastProcessedTimeRef.current = now;
          
          const nodesToUpdate = [...pendingNodesUpdate.current];
          pendingNodesUpdate.current = null;
          
          // Process the update outside of the current execution context
          setTimeout(() => {
            processStoreUpdate(nodesToUpdate);
            
            // Reset processing flag after a delay
            setTimeout(() => {
              isProcessingRef.current = false;
            }, 3000);
          }, 100);
        } catch (error) {
          console.error('Error processing throttled updates:', error);
          isProcessingRef.current = false;
        }
      }
    };
    
    // Schedule updates with much lower frequency
    updateIntervalRef.current = window.setInterval(processPendingUpdates, 3000);
    
    // Clean up
    return () => {
      if (updateIntervalRef.current !== null) {
        window.clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [pendingNodesUpdate, lastUpdateTimeRef, processStoreUpdate]);

  // Set up a cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        window.clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
    };
  }, [updateTimeoutRef]);
}
