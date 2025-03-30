
import { useCallback, useRef } from 'react';
import { Edge, useEdgesState, Connection, addEdge, Node } from '@xyflow/react';
import { validateConnection } from '../utils/flowUtils';

/**
 * Hook to manage edge state with validation
 */
export function useEdgeStateManagement(initialEdges: Edge[] = [], strategyStore: any) {
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState(initialEdges);
  const updateCycleRef = useRef(false);

  // Custom setEdges wrapper that also updates the store
  const setEdges = useCallback((updatedEdges: Edge[] | ((prevEdges: Edge[]) => Edge[])) => {
    // Skip if we're in an update cycle to prevent loops
    if (updateCycleRef.current) return;
    
    setLocalEdges((prevEdges) => {
      const newEdges = typeof updatedEdges === 'function'
        ? updatedEdges(prevEdges)
        : updatedEdges;
      
      // Use setTimeout to break potential update cycles
      setTimeout(() => {
        if (!updateCycleRef.current) {
          updateCycleRef.current = true;
          strategyStore.setEdges(newEdges);
          updateCycleRef.current = false;
        }
      }, 0);
      
      return newEdges;
    });
  }, [setLocalEdges, strategyStore]);

  // Handle connections with validation
  const onConnect = useCallback(
    (params: Connection, nodes: Node[]) => {
      if (!validateConnection(params, nodes)) return;
      
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      
      // Use setTimeout to break potential update cycles
      setTimeout(() => {
        if (!updateCycleRef.current) {
          updateCycleRef.current = true;
          strategyStore.addHistoryItem(strategyStore.nodes, newEdges);
          updateCycleRef.current = false;
        }
      }, 0);
    },
    [edges, setEdges, strategyStore]
  );

  return {
    edges,
    setEdges,
    onEdgesChange,
    onConnect
  };
}
