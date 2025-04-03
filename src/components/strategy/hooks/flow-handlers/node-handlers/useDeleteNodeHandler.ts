
import { useCallback } from 'react';
import { createDeleteNodeHandler } from '../../../utils/handlers';
import { UseDeleteNodeHandlerProps } from './types';

export const useDeleteNodeHandler = ({
  nodesRef,
  edgesRef,
  setNodes,
  setEdges,
  strategyStore,
  updateHandlingRef
}: UseDeleteNodeHandlerProps) => {
  // Create stable handler for deleting nodes
  return useCallback((id: string) => {
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
      const handler = createDeleteNodeHandler(
        nodesRef.current,
        edgesRef.current,
        setNodes,
        setEdges,
        strategyStore.current
      );
      handler(id);
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [setNodes, setEdges, updateHandlingRef, nodesRef, edgesRef, strategyStore]);
};
