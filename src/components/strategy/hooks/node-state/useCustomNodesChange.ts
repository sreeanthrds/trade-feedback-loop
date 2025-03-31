
import { useCallback, useRef } from 'react';
import { NodeChange } from '@xyflow/react';

/**
 * Custom hook for handling node changes with additional processing guards
 */
export function useCustomNodesChange(
  dragAwareHandler: (changes: NodeChange[], baseHandler: any, afterDragCallback: any) => void,
  baseChangeHandler: (changes: NodeChange[]) => void
) {
  // Use a ref to track if changes are being processed
  const isProcessingChangesRef = useRef(false);
  const pendingChangesRef = useRef<NodeChange[] | null>(null);
  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Process any pending changes
  const processPendingChanges = useCallback(() => {
    if (pendingChangesRef.current && !isProcessingChangesRef.current) {
      const changes = pendingChangesRef.current;
      pendingChangesRef.current = null;
      
      // Set processing flag
      isProcessingChangesRef.current = true;
      
      // Process changes with minimum delay
      setTimeout(() => {
        baseChangeHandler(changes);
        
        // Reset processing flag with a slight delay
        setTimeout(() => {
          isProcessingChangesRef.current = false;
          console.log('Processing complete, ready for new changes');
        }, 50);
      }, 0);
    }
  }, [baseChangeHandler]);

  // Create a custom handler that guards against concurrent processing
  const customNodesChangeHandler = useCallback((changes: NodeChange[]) => {
    // Skip if no changes
    if (!changes || changes.length === 0) return;
    
    console.log('Custom nodes change handler called with:', changes);
    
    // For drag operations, we want to process them immediately
    const hasDragChanges = changes.some(change => 
      change.type === 'position' && change.dragging !== undefined
    );
    
    if (hasDragChanges) {
      // For drag operations, process immediately without queueing
      dragAwareHandler(changes, baseChangeHandler, () => {
        isProcessingChangesRef.current = false;
      });
      return;
    }
    
    // If we're already processing changes
    if (isProcessingChangesRef.current) {
      // For other operations, append to existing changes if any
      if (pendingChangesRef.current) {
        pendingChangesRef.current = [...pendingChangesRef.current, ...changes];
      } else {
        // If no pending changes yet, create a new array
        pendingChangesRef.current = [...changes];
      }
      
      // Clear existing timeout if it exists
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      
      // Schedule processing of pending changes
      processingTimeoutRef.current = setTimeout(processPendingChanges, 100);
      
      return;
    }
    
    // If not processing, use the handler directly
    isProcessingChangesRef.current = true;
    
    // Use the base handler for non-drag changes
    baseChangeHandler(changes);
    
    // Reset processing flag after operation is complete
    setTimeout(() => {
      isProcessingChangesRef.current = false;
    }, 100);
  }, [dragAwareHandler, baseChangeHandler, processPendingChanges]);
  
  // Return the handler and the ref for external use
  return {
    customNodesChangeHandler,
    isProcessingChangesRef
  };
}
