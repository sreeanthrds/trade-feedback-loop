
import { useCallback } from 'react';
import { Edge, useEdgesState, Connection, Node as ReactFlowNode } from '@xyflow/react';
import { validateConnection } from '../utils/flowUtils';

/**
 * Hook to manage edge state with validation and store sync
 */
export function useEdgeStateManagement(initialEdges: Edge[] = [], strategyStore: any) {
  // Initialize edges state with direct value to avoid useState error
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Custom setEdges wrapper that also updates the store
  const setEdges = useCallback((updatedEdges: Edge[] | ((prevEdges: Edge[]) => Edge[])) => {
    // Always update local state for UI responsiveness
    setLocalEdges((prevEdges) => {
      // Handle both functional and direct updates
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
    (params: Connection, nodes: ReactFlowNode[]) => {
      if (!validateConnection(params, nodes)) return;
      
      // Use addEdge from @xyflow/react here
      const newEdges = [...edges, { 
        id: `e${params.source}-${params.target}`,
        source: params.source || '',
        target: params.target || '',
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle
      }];
      
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
