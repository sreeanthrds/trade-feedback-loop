
import { useState, useCallback, useRef, useEffect } from 'react';
import { Node, useNodesState } from '@xyflow/react';
import { deepEqual } from '../utils/deepEqual';

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
  const storeUpdateInProgressRef = useRef(false);

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
            const nodesToUpdate = [...pendingNodesUpdate.current];
            pendingNodesUpdate.current = null;
            
            // Introduce a delay to avoid immediate updates
            setTimeout(() => {
              if (!updateCycleRef.current && !storeUpdateInProgressRef.current) {
                updateCycleRef.current = true;
                storeUpdateInProgressRef.current = true;
                
                try {
                  strategyStore.setNodes(nodesToUpdate);
                  strategyStore.addHistoryItem(nodesToUpdate, strategyStore.edges);
                } catch (error) {
                  console.error('Error updating store after drag:', error);
                } finally {
                  // Reset flags after a delay
                  setTimeout(() => {
                    updateCycleRef.current = false;
                    storeUpdateInProgressRef.current = false;
                  }, 300);
                }
              }
            }, 300);
          }
        }
      }
    } finally {
      // Reset processing flag after a short delay to avoid immediate re-entry
      setTimeout(() => {
        isProcessingChangesRef.current = false;
      }, 50);
    }
  }, [onNodesChange, strategyStore]);

  // Custom setNodes wrapper with improved throttling and cycle detection
  const setNodes = useCallback((updatedNodes: Node[] | ((prevNodes: Node[]) => Node[])) => {
    // If already in an update cycle, skip to prevent loops
    if (updateCycleRef.current || storeUpdateInProgressRef.current) return;
    
    // Always update local state for UI responsiveness
    setLocalNodes((prevNodes) => {
      try {
        // Handle both functional and direct updates
        const newNodes = typeof updatedNodes === 'function' 
          ? updatedNodes(prevNodes) 
          : updatedNodes;
        
        // Skip if nodes haven't actually changed using deep equality
        if (deepEqual(newNodes, prevNodes)) {
          return prevNodes;
        }
        
        // Don't update store during dragging
        if (isDraggingRef.current) {
          pendingNodesUpdate.current = newNodes;
          return newNodes;
        }
        
        // Throttle updates to the store during frequent operations
        const now = Date.now();
        if (now - lastUpdateTimeRef.current > 400) { // Increased throttle time
          lastUpdateTimeRef.current = now;
          
          // Clear any pending timeout
          if (updateTimeoutRef.current !== null) {
            window.clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
          }
          
          // Schedule the update to the store with setTimeout to break the React update cycle
          updateTimeoutRef.current = window.setTimeout(() => {
            if (!updateCycleRef.current && !storeUpdateInProgressRef.current) {
              updateCycleRef.current = true;
              storeUpdateInProgressRef.current = true;
              
              try {
                strategyStore.setNodes(newNodes);
              } catch (error) {
                console.error('Error updating store in setNodes:', error);
              } finally {
                // Reset flags after a delay
                setTimeout(() => {
                  updateTimeoutRef.current = null;
                  updateCycleRef.current = false;
                  storeUpdateInProgressRef.current = false;
                }, 300);
              }
            }
          }, 300); // Increased delay
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

  // Process any pending updates that were throttled - with longer delays
  useEffect(() => {
    // Skip this effect during mount
    if (lastUpdateTimeRef.current === 0) {
      lastUpdateTimeRef.current = Date.now();
      return;
    }
    
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Only process pending updates if enough time has passed and not in a cycle
      if (pendingNodesUpdate.current && 
          now - lastUpdateTimeRef.current > 500 && 
          !updateCycleRef.current && 
          !storeUpdateInProgressRef.current) {
        
        updateCycleRef.current = true;
        storeUpdateInProgressRef.current = true;
        lastUpdateTimeRef.current = now;
        
        const nodesToUpdate = [...pendingNodesUpdate.current];
        pendingNodesUpdate.current = null;
        
        try {
          strategyStore.setNodes(nodesToUpdate);
        } catch (error) {
          console.error('Error processing pending updates:', error);
        } finally {
          // Reset flags after a delay
          setTimeout(() => {
            updateCycleRef.current = false;
            storeUpdateInProgressRef.current = false;
          }, 300);
        }
      }
    }, 500); // Check less frequently
    
    return () => clearInterval(interval);
  }, [strategyStore]);

  // Set up a cleanup function for timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current !== null) {
        window.clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
    };
  }, []);

  // Update selectedNode when nodes change (if it's among them)
  useEffect(() => {
    if (selectedNode) {
      const updatedSelectedNode = nodes.find(node => node.id === selectedNode.id);
      if (updatedSelectedNode && 
          !deepEqual(updatedSelectedNode, selectedNode)) {
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
