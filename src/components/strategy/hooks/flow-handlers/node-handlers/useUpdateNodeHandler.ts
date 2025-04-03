
import { useCallback } from 'react';
import { createUpdateNodeDataHandler } from '../../../utils/handlers';
import { v4 as uuidv4 } from 'uuid';
import { Node } from '@xyflow/react';
import { UseUpdateNodeHandlerProps, ExitNodeData } from './types';

export const useUpdateNodeHandler = ({
  nodesRef,
  setNodes,
  strategyStore,
  updateHandlingRef,
  setEdges
}: UseUpdateNodeHandlerProps) => {
  // Create stable handler for updating node data
  return useCallback((id: string, data: any) => {
    // Prevent recursive update loops
    if (updateHandlingRef.current) return;
    updateHandlingRef.current = true;
    
    setTimeout(() => {
      try {
        const handler = createUpdateNodeDataHandler(
          nodesRef.current,
          setNodes,
          strategyStore.current
        );
        
        // Special handling for exit nodes with re-entry toggle
        if (
          data?.exitNodeData &&
          data.exitNodeData?.reEntryConfig
        ) {
          const node = nodesRef.current.find(n => n.id === id);
          
          if (node) {
            // Use type assertion to safely access exitNodeData
            const nodeDataTyped = node.data as ExitNodeData;
            const oldConfig = nodeDataTyped?.exitNodeData?.reEntryConfig;
            const newConfig = data.exitNodeData.reEntryConfig;
            
            // Type-safe comparison of enabled property
            const oldEnabled = oldConfig ? oldConfig.enabled : false;
            const newEnabled = newConfig ? newConfig.enabled : false;
            
            // If re-entry was toggled on, create a retry node
            if (oldEnabled === false && newEnabled === true) {
              console.log('Re-entry was enabled, creating retry node');
              
              // Get node position
              const exitNode = nodesRef.current.find(n => n.id === id);
              if (exitNode) {
                const exitNodePosition = exitNode.position;
                
                // Create a retry node floating to the left of the exit node
                const retryNodeId = `retry-${uuidv4().substring(0, 6)}`;
                const retryNode: Node = {
                  id: retryNodeId,
                  type: 'retryNode',
                  position: {
                    x: exitNodePosition.x - 150,  // Position to the left
                    y: exitNodePosition.y + 20    // Slightly below
                  },
                  data: {
                    label: 'Re-entry',
                    actionType: 'retry',
                    retryConfig: {
                      groupNumber: newConfig.groupNumber || 1,
                      maxReEntries: newConfig.maxReEntries || 1
                    }
                  }
                };
                
                // Create regular edge from exit node to retry node (remove fixed-length)
                const connectingEdge = {
                  id: `e-${id}-${retryNodeId}`,
                  source: id,
                  target: retryNodeId,
                  style: { 
                    stroke: '#9b59b6', 
                    strokeWidth: 2 
                  },
                  sourceHandle: null,
                  targetHandle: null
                };
                
                // Find any entry node to connect with animated dashed edge
                const entryNodes = nodesRef.current.filter(n => n.type === 'entryNode');
                let dashEdge = null;
                
                if (entryNodes.length > 0) {
                  // Connect to the first entry node with a dashed animated edge
                  const targetEntryNode = entryNodes[0];
                  dashEdge = {
                    id: `e-${retryNodeId}-${targetEntryNode.id}`,
                    source: retryNodeId,
                    target: targetEntryNode.id,
                    type: 'dashEdge',
                    animated: true,
                    style: { 
                      stroke: '#9b59b6', 
                      strokeWidth: 2
                    }
                  };
                }
                
                // Update node data first
                handler(id, data);
                
                // Then add the retry node and edges
                setNodes((prev: Node[]) => [...prev, retryNode]);
                
                // Add edges (both connecting and dashed if available)
                if (dashEdge) {
                  setEdges((prev: any[]) => [...prev, connectingEdge, dashEdge]);
                } else {
                  setEdges((prev: any[]) => [...prev, connectingEdge]);
                }
                
                // Update store
                setTimeout(() => {
                  const updatedNodes = [...nodesRef.current, retryNode];
                  let updatedEdges = [...strategyStore.current.edges, connectingEdge];
                  if (dashEdge) {
                    updatedEdges.push(dashEdge);
                  }
                  
                  strategyStore.current.setNodes(updatedNodes);
                  strategyStore.current.setEdges(updatedEdges);
                  strategyStore.current.addHistoryItem(updatedNodes, updatedEdges);
                }, 100);
                
                return;
              }
            }
          }
        }
        
        // Default update behavior
        handler(id, data);
      } finally {
        // Reset the flag after a short delay
        setTimeout(() => {
          updateHandlingRef.current = false;
        }, 100);
      }
    }, 0);
  }, [setNodes, setEdges, updateHandlingRef, nodesRef, strategyStore]);
};
