
import { useCallback, useEffect } from 'react';
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
  // Process any pending updates that were throttled - with longer delays
  useEffect(() => {
    // Skip this effect during mount
    if (lastUpdateTimeRef.current === 0) {
      lastUpdateTimeRef.current = Date.now();
      return;
    }
    
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Only process pending updates if enough time has passed
      if (pendingNodesUpdate.current && 
          now - lastUpdateTimeRef.current > 500) {
        
        lastUpdateTimeRef.current = now;
        
        const nodesToUpdate = [...pendingNodesUpdate.current];
        pendingNodesUpdate.current = null;
        
        processStoreUpdate(nodesToUpdate);
      }
    }, 500); // Check less frequently
    
    return () => clearInterval(interval);
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
