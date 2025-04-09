
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
      
      // Update store in a separate cycle to prevent update loops
      setTimeout(() => {
        storeRef.current.setNodes(initialNodes);
        storeRef.current.setEdges([]);
        storeRef.current.resetHistory();
        storeRef.current.addHistoryItem(initialNodes, []);
        
        // Clear selection and close panel
        closePanel();
        
        // Clear localStorage for current strategy
        localStorage.removeItem('tradyStrategy');
        
        // Fit view after reset with delay
        if (instanceRef.current) {
          setTimeout(() => {
            instanceRef.current.fitView({ padding: 0.2 });
          }, 300);
        }
        
        toast({
          title: "Strategy reset",
          description: "Strategy has been reset to initial state."
        });
      }, 100);
    } finally {
      // Allow time for updates to process before releasing flag
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 500);
    }
  }, [setNodes, setEdges, closePanel, updateHandlingRef]);

  // Create import success handler with improved viewport handling
  const handleImportSuccess = useCallback(() => {
    // Skip if already handling updates
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    try {
      // Close panel if open
      closePanel();
      
      // Ensure we have a reference to the current flow instance
      if (!instanceRef.current) {
        console.warn('ReactFlow instance not available for fitting view');
        return;
      }
      
      // Use a longer timeout to make sure everything is rendered properly
      // This is crucial to prevent update loops - we need to wait for state to settle
      setTimeout(() => {
        try {
          console.log("Fitting view after import");
          instanceRef.current.fitView({ 
            padding: 0.2,
            includeHiddenNodes: false,
            duration: 800
          });
        } catch (e) {
          console.error("Error fitting view:", e);
        }
      }, 600);
    } finally {
      // Release update flag after sufficient time for async operations
      setTimeout(() => {
        updateHandlingRef.current = false;
      }, 1000);
    }
  }, [closePanel, updateHandlingRef]);

  return {
    resetStrategy,
    handleImportSuccess
  };
};
