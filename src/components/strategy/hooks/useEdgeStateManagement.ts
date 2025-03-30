
import React, { useCallback, useRef } from 'react';
import { Edge, useEdgesState, Connection, addEdge, Node } from '@xyflow/react';
import { validateConnection } from '../utils/flowUtils';
import { deepEqual } from '../utils/deepEqual';

/**
 * Hook to manage edge state with validation
 */
export function useEdgeStateManagement(initialEdges: Edge[] = [], strategyStore: any) {
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState(initialEdges);
  const updateCycleRef = useRef(false);
  const isProcessingEdgeUpdateRef = useRef(false);
  const pendingEdgeUpdateRef = useRef<Edge[] | null>(null);
  const lastEdgeUpdateTimeRef = useRef(0);
  const edgeUpdateTimeoutRef = useRef<number | null>(null);
  const storeUpdateInProgressRef = useRef(false);

  // Cleanup function for timeouts
  React.useEffect(() => {
    return () => {
      if (edgeUpdateTimeoutRef.current !== null) {
        window.clearTimeout(edgeUpdateTimeoutRef.current);
        edgeUpdateTimeoutRef.current = null;
      }
    };
  }, []);

  // Custom setEdges wrapper with improved cycle detection
  const setEdges = useCallback((updatedEdges: Edge[] | ((prevEdges: Edge[]) => Edge[])) => {
    // Skip if we're in an update cycle to prevent loops
    if (updateCycleRef.current || storeUpdateInProgressRef.current) return;
    
    // If we're already processing an edge update, queue it
    if (isProcessingEdgeUpdateRef.current) {
      pendingEdgeUpdateRef.current = typeof updatedEdges === 'function'
        ? updatedEdges(edges)
        : updatedEdges;
      return;
    }
    
    isProcessingEdgeUpdateRef.current = true;
    
    setLocalEdges((prevEdges) => {
      try {
        // Handle both functional and direct updates
        const newEdges = typeof updatedEdges === 'function'
          ? updatedEdges(prevEdges)
          : updatedEdges;
        
        // Skip if edges haven't actually changed using deep equality
        if (deepEqual(newEdges, prevEdges)) {
          isProcessingEdgeUpdateRef.current = false;
          return prevEdges;
        }
        
        // Throttle updates to prevent rapid succession
        const now = Date.now();
        if (now - lastEdgeUpdateTimeRef.current > 400) { // Increased throttle time
          lastEdgeUpdateTimeRef.current = now;
          
          // Clear any pending timeout
          if (edgeUpdateTimeoutRef.current !== null) {
            window.clearTimeout(edgeUpdateTimeoutRef.current);
            edgeUpdateTimeoutRef.current = null;
          }
          
          // Use setTimeout to break potential update cycles
          edgeUpdateTimeoutRef.current = window.setTimeout(() => {
            if (!updateCycleRef.current && !storeUpdateInProgressRef.current) {
              updateCycleRef.current = true;
              storeUpdateInProgressRef.current = true;
              
              try {
                strategyStore.setEdges(newEdges);
              } catch (error) {
                console.error('Error updating edge store:', error);
              } finally {
                // Reset flags after a delay
                setTimeout(() => {
                  updateCycleRef.current = false;
                  storeUpdateInProgressRef.current = false;
                  
                  // Process any pending edge update
                  if (pendingEdgeUpdateRef.current) {
                    const pendingEdges = pendingEdgeUpdateRef.current;
                    pendingEdgeUpdateRef.current = null;
                    setEdges(pendingEdges);
                  }
                  
                  isProcessingEdgeUpdateRef.current = false;
                }, 300);
              }
            } else {
              isProcessingEdgeUpdateRef.current = false;
            }
          }, 300); // Increased delay
        } else {
          // Queue the update for later
          pendingEdgeUpdateRef.current = newEdges;
          
          // Process the queued update after a delay
          setTimeout(() => {
            isProcessingEdgeUpdateRef.current = false;
            
            // Process the pending update if it exists
            if (pendingEdgeUpdateRef.current) {
              const pendingEdges = pendingEdgeUpdateRef.current;
              pendingEdgeUpdateRef.current = null;
              lastEdgeUpdateTimeRef.current = Date.now();
              setEdges(pendingEdges);
            }
          }, 200);
        }
        
        return newEdges;
      } catch (error) {
        console.error('Error in setEdges:', error);
        isProcessingEdgeUpdateRef.current = false;
        return prevEdges;
      }
    });
  }, [setLocalEdges, strategyStore, edges]);

  // Handle connections with validation and improved cycle detection
  const onConnect = useCallback(
    (params: Connection, nodes: Node[]) => {
      if (!validateConnection(params, nodes)) return;
      
      // Skip if we're in an update cycle or processing another update
      if (updateCycleRef.current || storeUpdateInProgressRef.current || isProcessingEdgeUpdateRef.current) return;
      
      // Add edge to local state
      const newEdges = addEdge(params, edges);
      setLocalEdges(newEdges);
      
      // Update the store with setTimeout to break cycles
      setTimeout(() => {
        if (!updateCycleRef.current && !storeUpdateInProgressRef.current) {
          updateCycleRef.current = true;
          storeUpdateInProgressRef.current = true;
          
          try {
            strategyStore.setEdges(newEdges);
            strategyStore.addHistoryItem(strategyStore.nodes, newEdges);
          } catch (error) {
            console.error('Error in onConnect:', error);
          } finally {
            // Reset flags after a delay
            setTimeout(() => {
              updateCycleRef.current = false;
              storeUpdateInProgressRef.current = false;
            }, 300);
          }
        }
      }, 300);
    },
    [edges, setLocalEdges, strategyStore]
  );

  return {
    edges,
    setEdges,
    onEdgesChange,
    onConnect
  };
}
