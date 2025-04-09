
import { useCallback, useRef, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import { initialNodes } from '../../utils/flowUtils';
import { createViewportAdjustmentHandler } from '../../utils/handlers/viewportHandlers';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const currentStrategyId = searchParams.get('id') || '';
  const currentStrategyName = searchParams.get('name') || 'Untitled Strategy';
  const resetInProgressRef = useRef(false);
  const currentStrategyIdRef = useRef(currentStrategyId);
  
  // Update refs when dependencies change
  useEffect(() => {
    storeRef.current = strategyStore;
    instanceRef.current = reactFlowInstance;
    nodesRef.current = nodes;
    currentStrategyIdRef.current = currentStrategyId;
  }, [strategyStore, reactFlowInstance, nodes, currentStrategyId]);

  // Create strategy reset handler - now with improved isolation to current strategy
  const resetStrategy = useCallback(() => {
    // Prevent multiple simultaneous resets
    if (resetInProgressRef.current || updateHandlingRef.current) {
      console.log("Reset already in progress, ignoring");
      return;
    }
    
    if (!currentStrategyId) {
      console.error("Cannot reset strategy without ID");
      toast({
        title: "Reset failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    resetInProgressRef.current = true;
    updateHandlingRef.current = true;
    
    try {
      // First clear all nodes and edges
      console.log(`RESET: Explicitly resetting strategy with ID: ${currentStrategyId} - ${currentStrategyName}`);
      
      // Set empty arrays first to clear everything
      setNodes([]);
      setEdges([]);
      
      // Close panel if open
      closePanel();
      
      // Reset store state after a short delay
      setTimeout(() => {
        if (storeRef.current) {
          storeRef.current.setNodes([]);
          storeRef.current.setEdges([]);
          storeRef.current.resetHistory();
          
          // Set to initial state after another brief delay
          setTimeout(() => {
            // Set initial nodes in both state and store
            setNodes(initialNodes);
            storeRef.current.setNodes(initialNodes);
            
            // Add to history
            storeRef.current.addHistoryItem(initialNodes, []);
            
            // Clear localStorage ONLY for current strategy - be specific about the key name
            const strategyKey = `strategy_${currentStrategyIdRef.current}`;
            console.log(`RESET: Removing specific strategy from localStorage: ${strategyKey}`);
            localStorage.removeItem(strategyKey);
            
            // Clear other related keys for this strategy
            localStorage.removeItem(`strategy_${currentStrategyIdRef.current}_created`);
            
            // Clear current working strategy only if it matches the current ID
            const currentWorkingStrategy = localStorage.getItem('tradyStrategy');
            if (currentWorkingStrategy) {
              try {
                const parsed = JSON.parse(currentWorkingStrategy);
                if (parsed.id === currentStrategyIdRef.current) {
                  console.log(`RESET: Removing working strategy with ID: ${currentStrategyIdRef.current}`);
                  localStorage.removeItem('tradyStrategy');
                } else {
                  console.log(`RESET: Working strategy has different ID (${parsed.id}), not removing`);
                }
              } catch (e) {
                console.error('Error parsing current working strategy:', e);
              }
            }
            
            // Update the strategies list by marking this strategy as reset
            updateStrategiesListForReset(currentStrategyIdRef.current);
            
            // Fit view after reset
            if (instanceRef.current) {
              setTimeout(() => {
                try {
                  instanceRef.current.fitView({ padding: 0.2 });
                } catch (e) {
                  console.error('Error fitting view:', e);
                }
              }, 300);
            }
            
            toast({
              title: "Strategy reset",
              description: `Strategy "${currentStrategyName}" has been reset to initial state.`
            });
            
            // Reset flags
            resetInProgressRef.current = false;
            updateHandlingRef.current = false;
          }, 200);
        } else {
          resetInProgressRef.current = false;
          updateHandlingRef.current = false;
        }
      }, 100);
    } catch (error) {
      console.error("Error during strategy reset:", error);
      resetInProgressRef.current = false;
      updateHandlingRef.current = false;
      
      toast({
        title: "Reset failed",
        description: "An error occurred while resetting the strategy",
        variant: "destructive"
      });
    }
  }, [setNodes, setEdges, closePanel, updateHandlingRef, currentStrategyId, currentStrategyName]);

  // Helper function to update strategies list when resetting
  const updateStrategiesListForReset = (strategyId: string) => {
    try {
      const strategiesJSON = localStorage.getItem('strategies');
      if (!strategiesJSON) return;
      
      const strategies = JSON.parse(strategiesJSON);
      
      // Find the strategy to modify
      const strategyIndex = strategies.findIndex((s: any) => s.id === strategyId);
      
      if (strategyIndex >= 0) {
        // Replace with a reset version rather than removing
        strategies[strategyIndex] = {
          ...strategies[strategyIndex],
          lastModified: new Date().toISOString(),
          description: "Reset trading strategy"
        };
        
        // Save updated list
        localStorage.setItem('strategies', JSON.stringify(strategies));
        
        // Trigger update event
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'strategies'
        }));
        
        console.log(`Updated strategy ${strategyId} in strategies list`);
      }
    } catch (e) {
      console.error('Error updating strategies list:', e);
    }
  };

  // Create import success handler with improved viewport handling
  const handleImportSuccess = useCallback(() => {
    // Skip if already handling updates
    if (updateHandlingRef.current) {
      console.log("Skipping import success handler - update already in progress");
      return;
    }
    
    console.log(`Import success handler called for strategy: ${currentStrategyIdRef.current}`);
    updateHandlingRef.current = true;
    
    try {
      // Close panel if open
      closePanel();
      
      // Force a store update to ensure UI reconciliation
      if (storeRef.current && nodesRef.current) {
        console.log("Forcing store update after import to ensure UI reconciliation");
        
        // Create a deep copy of the nodes to trigger state updates
        const nodesCopy = JSON.parse(JSON.stringify(nodesRef.current));
        storeRef.current.setNodes(nodesCopy);
      }
      
      // Ensure we have a reference to the current flow instance
      if (!instanceRef.current) {
        console.warn('ReactFlow instance not available for fitting view');
        updateHandlingRef.current = false;
        return;
      }
      
      // Use the dedicated viewport handler
      const adjustViewport = createViewportAdjustmentHandler(instanceRef.current);
      
      // Give the DOM time to update before adjusting viewport
      setTimeout(() => {
        try {
          console.log("Fitting view after import");
          adjustViewport();
        } catch (e) {
          console.error("Error fitting view:", e);
          
          // Fallback to basic fit view if the advanced handler fails
          instanceRef.current.fitView({ 
            padding: 0.2,
            includeHiddenNodes: false,
            duration: 600 
          });
        }
        
        // Release update flag after viewport adjustment
        setTimeout(() => {
          updateHandlingRef.current = false;
        }, 800);
      }, 800);
    } catch (error) {
      console.error("Error in import success handler:", error);
      updateHandlingRef.current = false;
    }
  }, [closePanel, updateHandlingRef]);

  return {
    resetStrategy,
    handleImportSuccess
  };
};
