
import { useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';

interface ThrottledNodeUpdateProps {
  pendingNodesUpdate: React.MutableRefObject<Node[] | null>;
  lastUpdateTimeRef: React.MutableRefObject<number>;
  updateTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  processStoreUpdate: (nodes: Node[]) => void;
}

/**
 * Hook to manage throttled node updates with much more aggressive throttling
 * and reduced render cycles
 */
export function useThrottledNodeUpdates({
  pendingNodesUpdate,
  lastUpdateTimeRef,
  updateTimeoutRef,
  processStoreUpdate
}: ThrottledNodeUpdateProps) {
  const isInitialRenderRef = useRef(true);
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastProcessedTimeRef = useRef(0);
  const isProcessingRef = useRef(false);
  const updateScheduledRef = useRef(false);
  
  // Process any pending updates that were throttled - with optimized interval
  useEffect(() => {
    // Skip processing during initial mount
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      lastUpdateTimeRef.current = Date.now();
      return () => {};
    }
    
    // Use a much more efficient approach with greatly reduced update frequency
    const processPendingUpdates = () => {
      // Skip if already processing or no updates are pending
      if (isProcessingRef.current || !pendingNodesUpdate.current) {
        return;
      }
      
      const now = Date.now();
      
      // Only process pending updates if enough time has passed
      // and we haven't processed recently
      if (now - lastUpdateTimeRef.current > 10000 && // Much longer wait (10s)
          now - lastProcessedTimeRef.current > 10000) { // Ensure at least 10s between updates
        
        // Mark as processing to prevent concurrent processing
        isProcessingRef.current = true;
        
        try {
          lastUpdateTimeRef.current = now;
          lastProcessedTimeRef.current = now;
          
          const nodesToUpdate = [...pendingNodesUpdate.current];
          pendingNodesUpdate.current = null;
          
          // Schedule the update outside of the current execution context
          // but only if we haven't already scheduled one
          if (!updateScheduledRef.current) {
            updateScheduledRef.current = true;
            
            setTimeout(() => {
              try {
                processStoreUpdate(nodesToUpdate);
              } catch (error) {
                console.error('Error processing throttled updates:', error);
              } finally {
                // Reset processing flags after a delay
                setTimeout(() => {
                  isProcessingRef.current = false;
                  updateScheduledRef.current = false;
                }, 5000); // Much longer cooldown period (5s)
              }
            }, 100);
          }
        } catch (error) {
          console.error('Error scheduling throttled updates:', error);
          isProcessingRef.current = false;
          updateScheduledRef.current = false;
        }
      }
    };
    
    // Schedule updates with much lower frequency (once every 5 seconds)
    updateIntervalRef.current = setInterval(processPendingUpdates, 5000);
    
    // Clean up
    return () => {
      if (updateIntervalRef.current !== null) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [pendingNodesUpdate, lastUpdateTimeRef, processStoreUpdate]);

  // Set up a cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
    };
  }, [updateTimeoutRef]);
}
