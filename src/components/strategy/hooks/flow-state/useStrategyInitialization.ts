
import { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { initialNodes } from '../../utils/flowUtils';

interface UseStrategyInitializationProps {
  isNew: boolean;
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  strategyStore: any;
}

/**
 * Hook to handle strategy initialization
 */
export function useStrategyInitialization({
  isNew,
  setNodes,
  setEdges,
  strategyStore
}: UseStrategyInitializationProps) {
  // Initialize with new strategy if isNew is true
  useEffect(() => {
    if (isNew) {
      console.log('Initializing new strategy with default nodes');
      
      // Clear any previous nodes and edges first
      setTimeout(() => {
        // First clear all nodes and edges
        setNodes([]);
        setEdges([]);
        
        // Then update store
        strategyStore.setNodes([]);
        strategyStore.setEdges([]);
        strategyStore.resetHistory();
        
        // Then set the initial nodes after a small delay to ensure clean start
        setTimeout(() => {
          setNodes(initialNodes);
          strategyStore.setNodes(initialNodes);
          
          // Wait for nodes to be set before adding to history
          setTimeout(() => {
            strategyStore.addHistoryItem(initialNodes, []);
            
            // Clear localStorage for good measure
            localStorage.removeItem('tradyStrategy');
            console.log('New strategy initialized with default nodes');
          }, 100);
        }, 100);
      }, 0);
    }
  }, [isNew, setNodes, setEdges, strategyStore]);
}
