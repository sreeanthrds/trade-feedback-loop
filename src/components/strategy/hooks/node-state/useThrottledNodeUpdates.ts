
import { useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';

/**
 * Hook to manage throttled node updates to prevent excessive store operations
 * Now with improved performance optimizations
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
  const lastProcessedTimeRef = useRef(0);
  
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
      
      // Only process pending updates if enough time has passed and we have updates
      if (pendingNodesUpdate.current && 
          now - lastUpdateTimeRef.current > 1000) { // Increased threshold for better performance
        
        // Skip processing if we recently processed (prevent rapid processing)
        if (now - lastProcessedTimeRef.current < 500) {
          updateIntervalRef.current = window.requestAnimationFrame(processPendingUpdates);
          return;
        }
        
        lastUpdateTimeRef.current = now;
        lastProcessedTimeRef.current = now;
        
        const nodesToUpdate = [...pendingNodesUpdate.current];
        const updateCount = nodesToUpdate.length;
        
        // Only log if the count has changed significantly to reduce spam
        if (Math.abs(updateCount - lastProcessedCountRef.current) > 5) {
          console.log(`Processing ${updateCount} pending nodes from throttled updates`);
          lastProcessedCountRef.current = updateCount;
        }
        
        pendingNodesUpdate.current = null;
        
        // Use setTimeout to break the processing out of the animation frame cycle
        // This gives the UI a chance to update before we process changes
        setTimeout(() => {
          processStoreUpdate(nodesToUpdate);
        }, 0);
      }
      
      // Schedule next check with a lower frequency
      updateIntervalRef.current = window.setTimeout(() => {
        window.requestAnimationFrame(processPendingUpdates);
      }, 200); // Add delay between frames to reduce CPU usage
    };
    
    // Start the update cycle using requestAnimationFrame with setTimeout to lower frequency
    updateIntervalRef.current = window.setTimeout(() => {
      window.requestAnimationFrame(processPendingUpdates);
    }, 200);
    
    console.log('Started throttled update processor with optimized timing');
    
    // Clean up
    return () => {
      if (updateIntervalRef.current !== null) {
        window.clearTimeout(updateIntervalRef.current);
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
