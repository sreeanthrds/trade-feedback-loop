
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
  const updateCycleRef = useRef(false);
  const isProcessingChangesRef = useRef(false);
  const lastNodesStringRef = useRef('');

  // Enhanced node change handler with improved drag detection
  const onNodesChangeWithDragDetection = useCallback((changes) => {
    // If already processing changes, avoid recursive updates
    if (isProcessingChangesRef.current) return;
    
    isProcessingChangesRef.current = true;
    
    try {
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
              if (!updateCycleRef.current) {
                updateCycleRef.current = true;
                try {
                  strategyStore.setNodes(pendingNodesUpdate.current);
                  strategyStore.addHistoryItem(pendingNodesUpdate.current, strategyStore.edges);
                } catch (error) {
                  console.error('Error updating store after drag:', error);
                } finally {
                  pendingNodesUpdate.current = null;
                  updateCycleRef.current = false;
                }
              }
            }, 100);
          }
        }
      }
    } finally {
      isProcessingChangesRef.current = false;
    }
  }, [onNodesChange, strategyStore]);

  // Custom setNodes wrapper with improved throttling and cycle detection
  const setNodes = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    // If already in an update cycle, skip to prevent loops
    if (updateCycleRef.current) return;
    
    // Always update local state for UI responsiveness
    setLocalNodes((prevNodes) => {
      try {
        // Handle both functional and direct updates
        const newNodes = typeof updatedNodes === 'function' 
          ? updatedNodes(prevNodes) 
          : updatedNodes;
        
        // Stringify nodes for comparison to detect actual changes
        const newNodesString = JSON.stringify(newNodes.map(n => ({
          id: n.id,
          type: n.type,
          position: n.position,
          data: n.data
        })));
        
        // Skip if nodes haven't actually changed
        if (newNodesString === lastNodesStringRef.current) {
          return prevNodes;
        }
        
        // Update the reference string for future comparisons
        lastNodesStringRef.current = newNodesString;
        
        // Don't update store during dragging
        if (isDraggingRef.current) {
          pendingNodesUpdate.current = newNodes;
          return newNodes;
        }
        
        // Throttle updates to the store during frequent operations
        const now = Date.now();
        if (now - lastUpdateTimeRef.current > 200) {
          lastUpdateTimeRef.current = now;
          
          // Clear any pending timeout
          if (updateTimeoutRef.current !== null) {
            window.clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
          }
          
          // Schedule the update to the store with setTimeout to break the React update cycle
          updateTimeoutRef.current = window.setTimeout(() => {
            if (!updateCycleRef.current) {
              updateCycleRef.current = true;
              try {
                strategyStore.setNodes(newNodes);
              } catch (error) {
                console.error('Error updating store in setNodes:', error);
              } finally {
                updateTimeoutRef.current = null;
                updateCycleRef.current = false;
              }
            }
          }, 100);
        } else {
          pendingNodesUpdate.current = newNodes;
        }
        
        return newNodes;
      } catch (error) {
        console.error('Error in setNodes:', error);
        return prevNodes;
      }
    });
  }, [setLocalNodes, strategyStore]);

  // Process any pending updates that were throttled
  useEffect(() => {
    // Skip this effect during mount
    if (lastUpdateTimeRef.current === 0) {
      lastUpdateTimeRef.current = Date.now();
      return;
    }
    
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Only process pending updates if enough time has passed
      if (pendingNodesUpdate.current && now - lastUpdateTimeRef.current > 200 && !updateCycleRef.current) {
        updateCycleRef.current = true;
        lastUpdateTimeRef.current = now;
        
        const nodesToUpdate = pendingNodesUpdate.current;
        pendingNodesUpdate.current = null;
        
        try {
          strategyStore.setNodes(nodesToUpdate);
        } catch (error) {
          console.error('Error processing pending updates:', error);
        } finally {
          updateCycleRef.current = false;
        }
      }
    }, 250);
    
    return () => clearInterval(interval);
  }, [strategyStore]);

  // Set up a cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        window.clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Update selectedNode when nodes change (if it's among them)
  useEffect(() => {
    if (selectedNode) {
      const updatedSelectedNode = nodes.find(node => node.id === selectedNode.id);
      if (updatedSelectedNode && 
          JSON.stringify(updatedSelectedNode) !== JSON.stringify(selectedNode)) {
        setSelectedNode(updatedSelectedNode);
      } else if (!updatedSelectedNode) {
        // Clear selected node if it's been removed
        setSelectedNode(null);
      }
    }
  }, [nodes, selectedNode]);

  return {
    nodes,
    setNodes,
    onNodesChange: onNodesChangeWithDragDetection,
    selectedNode,
    setSelectedNode,
    isDraggingRef
  };
}
