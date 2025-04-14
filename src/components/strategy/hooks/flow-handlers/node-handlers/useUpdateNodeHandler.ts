
import { useCallback, useRef } from 'react';
import { createUpdateNodeDataHandler } from '../../../utils/handlers';
import { UseUpdateNodeHandlerProps } from './types';
import { handleReEntryToggle } from './handlers/reEntryToggleHandler';

export const useUpdateNodeHandler = ({
  nodesRef,
  setNodes,
  strategyStore,
  updateHandlingRef,
  setEdges
}: UseUpdateNodeHandlerProps) => {
  // Add a debounce mechanism for synchronization updates
  const syncTimeoutRef = useRef<number | null>(null);
  
  // Create stable handler for updating node data
  return useCallback((id: string, data: any) => {
    // Prevent recursive update loops
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    // Clear any pending sync timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    
    setTimeout(() => {
      try {
        const handler = createUpdateNodeDataHandler(
          nodesRef.current,
          setNodes,
          strategyStore.current
        );
        
        // Special handling for exit nodes with re-entry toggle
        if (
          data?.exitNodeData &&
          data.exitNodeData?.reEntryConfig !== undefined
        ) {
          const node = nodesRef.current.find(n => n.id === id);
          
          if (node) {
            // Try to handle re-entry toggle
            const wasHandled = handleReEntryToggle({
              node,
              id,
              data,
              oldData: node.data,
              nodes: nodesRef.current, 
              edges: strategyStore.current.edges,
              updateNodeData: handler,
              setNodes,
              setEdges,
              syncTimeoutRef
            });
            
            // If the toggle was handled, return early
            if (wasHandled) {
              return;
            }
          }
        }
        
        // Default update behavior
        handler(id, data);
      } finally {
        // Reset the flag after a short delay
        setTimeout(() => {
          updateHandlingRef.current = false;
        }, 150);
      }
    }, 0);
  }, [setNodes, setEdges, updateHandlingRef, nodesRef, strategyStore]);
};
