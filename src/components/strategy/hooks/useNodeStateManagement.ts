
import { useState, useCallback, useRef, useEffect } from 'react';
import { Node, useNodesState } from '@xyflow/react';

/**
 * Hook to manage node state with optimized update handling
 */
export function useNodeStateManagement(initialNodes: Node[], strategyStore: any) {
  const [nodes, setLocalNodes, onNodesChange] = useNodesState(initialNodes);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const isDraggingRef = useRef(false);
  const pendingNodesUpdate = useRef<Node[] | null>(null);
  const lastUpdateTimeRef = useRef(0);
  const updateTimeoutRef = useRef<number | null>(null);

  // Enhanced node change handler with improved drag detection
  const onNodesChangeWithDragDetection = useCallback((changes) => {
    // Apply the changes to nodes immediately for UI responsiveness
    onNodesChange(changes);
    
    // Detect drag operations
    const dragChange = changes.find(change => 
      change.type === 'position' && change.dragging !== undefined
    );
    
    if (dragChange) {
      if (dragChange.dragging) {
        // Drag started or continuing
        isDraggingRef.current = true;
      } else if (isDraggingRef.current) {
        // Drag ended
        isDraggingRef.current = false;
        
        // Apply the pending update once the drag is complete
        if (pendingNodesUpdate.current) {
          // Use setTimeout to break the React update cycle
          setTimeout(() => {
            strategyStore.setNodes(pendingNodesUpdate.current);
            strategyStore.addHistoryItem(pendingNodesUpdate.current, strategyStore.edges);
            pendingNodesUpdate.current = null;
          }, 0);
        }
      }
    }
  }, [onNodesChange, strategyStore]);

  // Custom setNodes wrapper with improved throttling
  const setNodes = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    // Always update local state for UI responsiveness
    setLocalNodes((prevNodes) => {
      // Handle both functional and direct updates
      const newNodes = typeof updatedNodes === 'function' 
        ? updatedNodes(prevNodes) 
        : updatedNodes;
      
      // Add or update timestamp to force re-render and ensure node stability
      const nodesWithTimestamp = newNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          _lastUpdated: node.data?._lastUpdated || Date.now()
        },
        // Round position values to prevent floating point issues
        position: {
          x: Math.round(node.position.x),
          y: Math.round(node.position.y)
        }
      }));
      
      // Don't update store during dragging
      if (isDraggingRef.current) {
        pendingNodesUpdate.current = nodesWithTimestamp;
        return nodesWithTimestamp;
      }
      
      // Throttle updates to the store during frequent operations
      const now = Date.now();
      if (now - lastUpdateTimeRef.current > 100) {
        lastUpdateTimeRef.current = now;
        
        // Clear any pending timeout
        if (updateTimeoutRef.current !== null) {
          window.clearTimeout(updateTimeoutRef.current);
          updateTimeoutRef.current = null;
        }
        
        // Schedule the update to the store with setTimeout to break the React update cycle
        updateTimeoutRef.current = window.setTimeout(() => {
          strategyStore.setNodes(nodesWithTimestamp);
          updateTimeoutRef.current = null;
        }, 50);
      } else {
        pendingNodesUpdate.current = nodesWithTimestamp;
      }
      
      return nodesWithTimestamp;
    });
  }, [setLocalNodes, strategyStore]);

  // Set up a cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        window.clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    nodes,
    setNodes,
    onNodesChange: onNodesChangeWithDragDetection,
    selectedNode,
    setSelectedNode,
    isDraggingRef
  };
}
