
import { useCallback, useRef, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { 
  createResetStrategyHandler,
  createImportSuccessHandler,
  createViewportAdjustmentHandler
} from '../../utils/handlers';
import { initialNodes } from '../../utils/flowUtils';

interface UseStrategyHandlersProps {
  strategyStore: any;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  reactFlowInstance: any;
  closePanel: () => void;
}

export const useStrategyHandlers = ({
  strategyStore,
  setNodes,
  setEdges,
  reactFlowInstance,
  closePanel
}: UseStrategyHandlersProps) => {
  // Create stable refs to latest values
  const storeRef = useRef(strategyStore);
  const instanceRef = useRef(reactFlowInstance);
  
  // Update refs when dependencies change
  useEffect(() => {
    storeRef.current = strategyStore;
    instanceRef.current = reactFlowInstance;
  }, [strategyStore, reactFlowInstance]);

  // Create stable handler for resetting the strategy
  const resetStrategy = useCallback(() => {
    const handler = createResetStrategyHandler(
      setNodes,
      setEdges,
      storeRef.current,
      initialNodes,
      closePanel
    );
    handler();
  }, [setNodes, setEdges, closePanel]);

  // Create stable handler for handling import success
  const handleImportSuccess = useCallback(() => {
    // First notify that import was successful
    const importHandler = createImportSuccessHandler(instanceRef.current);
    importHandler();
    
    // Then adjust the viewport
    const viewportHandler = createViewportAdjustmentHandler(instanceRef.current);
    viewportHandler();
  }, []);

  return {
    resetStrategy,
    handleImportSuccess
  };
};
