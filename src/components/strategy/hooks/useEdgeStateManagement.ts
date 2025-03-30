
import { useCallback } from 'react';
import { Edge, useEdgesState, Connection, addEdge, Node } from '@xyflow/react';
import { validateConnection } from '../utils/flowUtils';

/**
 * Hook to manage edge state with validation
 */
export function useEdgeStateManagement(initialEdges: Edge[] = [], strategyStore: any) {
  // Initialize with direct value to avoid React "Should have a queue" error
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Custom setEdges wrapper that also updates the store
  const setEdges = useCallback((updatedEdges: Edge[] | ((prevEdges: Edge[]) => Edge[])) => {
    setLocalEdges((prevEdges) => {
      const newEdges = typeof updatedEdges === 'function'
        ? updatedEdges(prevEdges)
        : updatedEdges;
      
      // Update store only if edges have changed
      if (JSON.stringify(prevEdges) !== JSON.stringify(newEdges)) {
        strategyStore.setEdges(newEdges);
      }
      return newEdges;
    });
  }, [setLocalEdges, strategyStore]);

  // Handle connections with validation
  const onConnect = useCallback(
    (params: Connection, nodes: Node[]) => {
      if (!validateConnection(params, nodes)) return;
      
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      strategyStore.addHistoryItem(strategyStore.nodes, newEdges);
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
