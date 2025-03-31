
import { useCallback, useRef, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { handleError } from '../../utils/errorHandling';

/**
 * Hook to manage the processing of queued node updates
 */
export function useUpdateProcessing() {
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingChangesRef = useRef(false);
  const pendingProcessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
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
    // Clear any existing timeouts to prevent multiple updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
    
    // Skip if we're already processing changes
    if (isProcessingChangesRef.current) {
      return;
    }
    
    // Set a flag to indicate that we're processing changes
    isProcessingChangesRef.current = true;
    
    // Set a shorter timeout to reduce update frequency but avoid freezing
    updateTimeoutRef.current = setTimeout(() => {
      try {
        process(nodes);
      } catch (error) {
        handleError(error, 'scheduleUpdate');
      } finally {
        updateTimeoutRef.current = null;
        
        // Reset the processing flag after a brief delay
        setTimeout(() => {
          isProcessingChangesRef.current = false;
        }, 100);
      }
    }, 300); // Reduced from 2000ms to 300ms
  }, []);

  const cleanup = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
    
    if (pendingProcessTimeoutRef.current) {
      clearTimeout(pendingProcessTimeoutRef.current);
      pendingProcessTimeoutRef.current = null;
    }
    
    isProcessingChangesRef.current = false;
  }, []);

  return {
    updateTimeoutRef,
    isProcessingChangesRef,
    scheduleUpdate,
    cleanup
  };
}
