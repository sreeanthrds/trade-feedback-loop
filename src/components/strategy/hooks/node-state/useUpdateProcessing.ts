
import { useCallback, useRef, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { handleError } from '../../utils/errorHandling';

/**
 * Hook to manage the processing of queued node updates
 * with improved performance and reduced timeouts
 */
export function useUpdateProcessing() {
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingChangesRef = useRef(false);
  const pendingProcessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProcessTimeRef = useRef(0);
  
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
    
    // Skip if we're already processing changes or processed very recently
    const now = Date.now();
    if (isProcessingChangesRef.current || now - lastProcessTimeRef.current < 150) {
      return;
    }
    
    // Set a flag to indicate that we're processing changes
    isProcessingChangesRef.current = true;
    
    // Use a shorter timeout for more responsive updates
    updateTimeoutRef.current = setTimeout(() => {
      try {
        lastProcessTimeRef.current = Date.now();
        process(nodes);
      } catch (error) {
        handleError(error, 'scheduleUpdate');
      } finally {
        updateTimeoutRef.current = null;
        
        // Reset the processing flag after a brief delay
        setTimeout(() => {
          isProcessingChangesRef.current = false;
        }, 50);
      }
    }, 100); // Reduced from 300ms for more responsive updates
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
