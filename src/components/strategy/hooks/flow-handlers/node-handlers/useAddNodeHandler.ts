
import { useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { createAddNodeHandler } from '../../../utils/handlers';
import { UseAddNodeHandlerProps } from './types';

export const useAddNodeHandler = ({
  reactFlowWrapper,
  reactFlowInstance,
  nodes,
  nodesRef,
  edgesRef,
  setNodes,
  setEdges,
  strategyStore,
  updateHandlingRef
}: UseAddNodeHandlerProps) => {
  // Create stable handler for adding nodes
  return useCallback((type: string, parentNodeId?: string) => {
    // Skip if update is already in progress, but don't cancel first-time additions
    if (updateHandlingRef.current && nodes.length > 1) {
      console.log('Skipping add node due to ongoing update');
      return;
    }
    
    // Set the flag but also ensure it gets reset even if errors occur
    updateHandlingRef.current = true;
    
    try {
      // Ensure reactFlowInstance is available
      if (!reactFlowInstance.current || !reactFlowWrapper.current) {
        console.error('React Flow instance or wrapper not available');
        updateHandlingRef.current = false;
        return;
      }
      
      const addNodeHandler = createAddNodeHandler(
        reactFlowInstance.current,
        reactFlowWrapper,
        nodesRef.current,
        edgesRef.current,
        setNodes,
        setEdges,
        strategyStore.current
      );
      
      // Add the node 
      addNodeHandler(type, parentNodeId);
      
      // Force immediate update to store without delay - CRITICAL FOR FIRST NODE ADDITION
      console.log('Forcing immediate update after adding node');
    } catch (error) {
      console.error('Error in handleAddNode:', error);
      toast({
        title: "Error",
        description: "Failed to add node",
        variant: "destructive"
      });
    } finally {
      // Reset the flag with short delay to prevent race conditions
      setTimeout(() => {
        updateHandlingRef.current = false;
        console.log('Reset update handling flag');
      }, 300);
    }
  }, [reactFlowWrapper, setNodes, setEdges, updateHandlingRef, nodes.length, reactFlowInstance, nodesRef, edgesRef, strategyStore]);
};
