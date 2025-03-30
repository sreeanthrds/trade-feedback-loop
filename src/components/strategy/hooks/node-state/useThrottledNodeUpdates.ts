
import { useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';

/**
 * Hook to manage throttled node updates to prevent excessive store operations
 * Now with improved logging
 */
export function useThrottledNodeUpdates({
  pendingNodesUpdate,
  lastUpdateTimeRef,
  updateTimeoutRef,
  processStoreUpdate
}) {
  const isInitialRenderRef = useRef(true);
  const updateIntervalRef = useRef<number | null>(null);
  const lastProcessedCountRef = useRef(0);
  
  // Process any pending updates that were throttled - with optimized interval
  useEffect(() => {
    // Skip processing during initial mount
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      lastUpdateTimeRef.current = Date.now();
      console.log('ThrottledNodeUpdates initialized');
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
        const updateCount = nodesToUpdate.length;
        
        // Only log if the count has changed to reduce spam
        if (updateCount !== lastProcessedCountRef.current) {
          console.log(`Processing ${updateCount} pending nodes from throttled updates`);
          lastProcessedCountRef.current = updateCount;
        }
        
        pendingNodesUpdate.current = null;
        
        processStoreUpdate(nodesToUpdate);
      }
      
      // Schedule next check
      updateIntervalRef.current = window.requestAnimationFrame(processPendingUpdates);
    };
    
    // Start the update cycle using requestAnimationFrame instead of setInterval
    updateIntervalRef.current = window.requestAnimationFrame(processPendingUpdates);
    console.log('Started throttled update processor using requestAnimationFrame');
    
    // Clean up
    return () => {
      if (updateIntervalRef.current !== null) {
        window.cancelAnimationFrame(updateIntervalRef.current);
        updateIntervalRef.current = null;
        console.log('Cleaned up throttled update processor');
      }
    };
  }, [pendingNodesUpdate, lastUpdateTimeRef, processStoreUpdate]);

  // Set up a cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        window.clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
        console.log('Cleaned up pending update timeout');
      }
    };
  }, [updateTimeoutRef]);
}
