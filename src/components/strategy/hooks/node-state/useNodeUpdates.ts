
import { useCallback, useMemo, useEffect } from 'react';
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
  
  // Add cleanup effect to prevent memory leaks and lingering timers
  useEffect(() => {
    return () => {
      cleanupNodeUpdateStore();
      cleanupUpdateProcessing();
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
