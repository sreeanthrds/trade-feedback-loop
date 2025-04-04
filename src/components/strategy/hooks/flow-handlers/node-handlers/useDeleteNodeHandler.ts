import { useCallback } from 'react';
import { createDeleteNodeHandler } from '../../../utils/handlers';
import { useVpsStore } from '@/hooks/useVpsStore';
import { UseDeleteNodeHandlerProps } from './types';

export const useDeleteNodeHandler = ({
  nodesRef,
  edgesRef,
  setNodes,
  setEdges,
  strategyStore,
  updateHandlingRef
}: UseDeleteNodeHandlerProps) => {
  // Get access to the VPS store
  const { setPositions } = useVpsStore();
  
  // Create stable handler for deleting nodes
  return useCallback((id: string) => {
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
      // First, get the node that's being deleted to find any associated positions
      const nodeToDelete = nodesRef.current.find(node => node.id === id);
      
      // Standard delete handler
      const handler = createDeleteNodeHandler(
        nodesRef.current,
        edgesRef.current,
        setNodes,
        setEdges,
        strategyStore.current
      );
      
      // Execute the deletion
      handler(id);
      
      // After the node is deleted, sync remaining nodes' positions with VPS
      // This ensures we only keep positions from nodes that still exist
      setTimeout(() => {
        // Extract positions from all remaining nodes
        const remainingPositions = nodesRef.current.reduce((acc, node) => {
          if (node.data?.positions && Array.isArray(node.data.positions)) {
            return [...acc, ...node.data.positions];
          }
          return acc;
        }, []);
        
        // Update the VPS store with only positions from remaining nodes
        setPositions(remainingPositions);
      }, 50);
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [setNodes, setEdges, updateHandlingRef, nodesRef, edgesRef, strategyStore, setPositions]);
};
