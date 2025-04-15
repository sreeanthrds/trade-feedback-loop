
import { useCallback, useMemo, useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';
import { shouldUpdateNodes } from '../../utils/performanceUtils';
import { useNodeUpdateStore } from './useNodeUpdateStore';
import { useUpdateProcessing } from './useUpdateProcessing';
import { handleError } from '../../utils/errorHandling';

/**
 * Hook to manage throttled node updates and prevent update cycles
 * Optimized for better performance with large node sets
 */
export function useNodeUpdates(strategyStore: any) {
  // Use more focused hooks for specific functionality
  const {
    lastUpdateTimeRef,
    updateCycleRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    cleanup: cleanupNodeUpdateStore
  } = useNodeUpdateStore(strategyStore);
  
  const {
    updateTimeoutRef,
    isProcessingChangesRef,
    scheduleUpdate,
    cleanup: cleanupUpdateProcessing
  } = useUpdateProcessing();
  
  // Track consecutive updates to detect potential infinite loops
  const consecutiveUpdatesRef = useRef({ count: 0, time: 0 });
  
  // Add update cycle detection
  useEffect(() => {
    const checkUpdateCycles = () => {
      const now = Date.now();
      if (now - consecutiveUpdatesRef.current.time < 1000) {
        consecutiveUpdatesRef.current.count++;
        
        // If too many updates in a short time, might be an infinite loop
        if (consecutiveUpdatesRef.current.count > 30) {
          console.warn('Potential infinite render cycle detected, breaking cycle');
          updateCycleRef.current = true;
          
          // Reset after a short delay
          setTimeout(() => {
            updateCycleRef.current = false;
            consecutiveUpdatesRef.current.count = 0;
          }, 2000);
        }
      } else {
        // Reset counter if enough time has passed
        consecutiveUpdatesRef.current.count = 1;
      }
      consecutiveUpdatesRef.current.time = now;
    };
    
    const interval = setInterval(checkUpdateCycles, 500);
    return () => clearInterval(interval);
  }, [updateCycleRef]);
  
  // Add cleanup effect to prevent memory leaks and lingering timers
  useEffect(() => {
    return () => {
      cleanupNodeUpdateStore();
      cleanupUpdateProcessing();
      consecutiveUpdatesRef.current.count = 0;
    };
  }, [cleanupNodeUpdateStore, cleanupUpdateProcessing]);
  
  // Return stable references to prevent re-renders
  return useMemo(() => ({
    lastUpdateTimeRef,
    updateTimeoutRef,
    updateCycleRef,
    isProcessingChangesRef,
    storeUpdateInProgressRef,
    processStoreUpdate,
    shouldUpdateNodes,
    scheduleUpdate,
    handleError
  }), [processStoreUpdate, scheduleUpdate]);
}
