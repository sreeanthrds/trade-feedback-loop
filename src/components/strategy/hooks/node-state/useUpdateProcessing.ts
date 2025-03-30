
import { useCallback, useRef, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { handleError } from '../../utils/errorHandling';

/**
 * Hook to manage the processing of queued node updates
 */
export function useUpdateProcessing() {
  const updateTimeoutRef = useRef<number | null>(null);
  const isProcessingChangesRef = useRef(false);
  const pendingProcessTimeoutRef = useRef<number | null>(null);
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (pendingProcessTimeoutRef.current) {
        clearTimeout(pendingProcessTimeoutRef.current);
        pendingProcessTimeoutRef.current = null;
      }
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
    };
  }, []);

  const scheduleUpdate = useCallback((nodes: Node[], process: (nodes: Node[]) => void) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = window.setTimeout(() => {
      try {
        process(nodes);
      } catch (error) {
        handleError(error, 'scheduleUpdate');
      } finally {
        updateTimeoutRef.current = null;
      }
    }, 1000);
  }, []);

  return {
    updateTimeoutRef,
    isProcessingChangesRef,
    scheduleUpdate
  };
}
