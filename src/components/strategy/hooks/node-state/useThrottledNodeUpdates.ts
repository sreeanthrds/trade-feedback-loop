
import { useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';

/**
 * Hook to manage throttled node updates to prevent excessive store operations
 */
export function useThrottledNodeUpdates({
  pendingNodesUpdate,
  lastUpdateTimeRef,
  updateTimeoutRef,
  processStoreUpdate
}) {
  const isInitialRenderRef = useRef(true);
  const updateIntervalRef = useRef<number | null>(null);
  
  // Process any pending updates that were throttled - with optimized interval
  useEffect(() => {
    // Skip processing during initial mount
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      lastUpdateTimeRef.current = Date.now();
      return;
    }
    
    // Use a more efficient approach with requestAnimationFrame
    const processPendingUpdates = () => {
      const now = Date.now();
      
      // Only process pending updates if enough time has passed
      if (pendingNodesUpdate.current && 
          now - lastUpdateTimeRef.current > 600) { // Increased threshold for better performance
        
        lastUpdateTimeRef.current = now;
        
        const nodesToUpdate = [...pendingNodesUpdate.current];
        pendingNodesUpdate.current = null;
        
        processStoreUpdate(nodesToUpdate);
      }
      
      // Schedule next check
      updateIntervalRef.current = window.requestAnimationFrame(processPendingUpdates);
    };
    
    // Start the update cycle using requestAnimationFrame instead of setInterval
    updateIntervalRef.current = window.requestAnimationFrame(processPendingUpdates);
    
    // Clean up
    return () => {
      if (updateIntervalRef.current !== null) {
        window.cancelAnimationFrame(updateIntervalRef.current);
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
