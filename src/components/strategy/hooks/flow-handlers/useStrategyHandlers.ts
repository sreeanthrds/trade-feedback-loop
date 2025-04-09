
import { useCallback, useRef, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { initialNodes } from '../../utils/flowUtils';

interface UseStrategyHandlersProps {
  strategyStore: any;
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  reactFlowInstance: any;
  closePanel: () => void;
  updateHandlingRef: React.MutableRefObject<boolean>;
}

export const useStrategyHandlers = ({
  strategyStore,
  nodes,
  setNodes,
  setEdges,
  reactFlowInstance,
  closePanel,
  updateHandlingRef
}: UseStrategyHandlersProps) => {
  // Create stable refs to latest values
  const storeRef = useRef(strategyStore);
  const instanceRef = useRef(reactFlowInstance);
  const nodesRef = useRef(nodes);
  
  // Update refs when dependencies change
  useEffect(() => {
    storeRef.current = strategyStore;
    instanceRef.current = reactFlowInstance;
    nodesRef.current = nodes;
  }, [strategyStore, reactFlowInstance, nodes]);

  // Create strategy reset handler
  const resetStrategy = useCallback(() => {
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
      // Reset to initial state
      setNodes(initialNodes);
      setEdges([]);
      
      // Update store
      storeRef.current.setNodes(initialNodes);
      storeRef.current.setEdges([]);
      storeRef.current.resetHistory();
      storeRef.current.addHistoryItem(initialNodes, []);
      
      // Clear selection and close panel
      closePanel();
      
      // Clear localStorage for current strategy
      localStorage.removeItem('tradyStrategy');
      
      // Fit view after reset
      if (instanceRef.current) {
        setTimeout(() => {
          instanceRef.current.fitView({ padding: 0.2 });
        }, 100);
      }
      
      toast({
        title: "Strategy reset",
        description: "Strategy has been reset to initial state."
      });
    } finally {
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 100);
    }
  }, [setNodes, setEdges, closePanel, updateHandlingRef]);

  // Create import success handler
  const handleImportSuccess = useCallback(() => {
    // Fit view after successful import
    if (instanceRef.current) {
      setTimeout(() => {
        instanceRef.current.fitView({ padding: 0.2 });
      }, 200);
    }
    
    // Close panel if open
    closePanel();
    
    toast({
      title: "Import successful",
      description: "Strategy imported successfully."
    });
  }, [closePanel]);

  return {
    resetStrategy,
    handleImportSuccess
  };
};
