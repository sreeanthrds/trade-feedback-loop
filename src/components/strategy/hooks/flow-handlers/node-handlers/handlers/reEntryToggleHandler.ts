
import { Node } from '@xyflow/react';
import { handleReEntryEnabled, handleReEntryDisabled } from '../utils/reEntryOperations';
import { ExitNodeData } from '../types';

/**
 * Handles toggling re-entry configuration for exit nodes
 */
export function handleReEntryToggle({
  node,
  id,
  data,
  oldData,
  nodes,
  edges,
  updateNodeData,
  setNodes,
  setEdges,
  syncTimeoutRef
}: {
  node: Node;
  id: string;
  data: any;
  oldData: any;
  nodes: Node[];
  edges: any[];
  updateNodeData: (id: string, data: any) => void;
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
  setEdges: (edges: any[] | ((eds: any[]) => any[])) => void;
  syncTimeoutRef: React.MutableRefObject<number | null>;
}): boolean {
  if (!node || !data?.exitNodeData?.reEntryConfig) {
    return false;
  }
  
  // Type-safe access to re-entry configuration
  const typedNodeData = node.data as ExitNodeData;
  const oldConfig = typedNodeData?.exitNodeData?.reEntryConfig;
  const newConfig = data.exitNodeData.reEntryConfig;
  
  // Type-safe comparison of enabled property
  const oldEnabled = oldConfig ? oldConfig.enabled : false;
  const newEnabled = newConfig ? newConfig.enabled : false;
  
  // Handle toggling re-entry on
  if (oldEnabled === false && newEnabled === true) {
    // Helper to add to store
    const addToStore = (updatedNodes: Node[], updatedEdges: any[]) => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      
      syncTimeoutRef.current = window.setTimeout(() => {
        if (updatedNodes.length > 0) {
          const strategyStore = {
            setNodes: (nodes: Node[]) => {},
            setEdges: (edges: any[]) => {},
            addHistoryItem: (nodes: Node[], edges: any[]) => {},
            edges: edges
          };
          
          strategyStore.setNodes?.(updatedNodes);
          strategyStore.setEdges?.(updatedEdges);
          strategyStore.addHistoryItem?.(updatedNodes, updatedEdges);
        }
      }, 100);
    };
    
    return handleReEntryEnabled(node, id, data, nodes, updateNodeData, setNodes, setEdges, addToStore);
  }
  // Handle toggling re-entry off
  else if (oldEnabled === true && newEnabled === false) {
    // Helper to add to store
    const addToStore = (updatedNodes: Node[], updatedEdges: any[]) => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      
      syncTimeoutRef.current = window.setTimeout(() => {
        if (updatedNodes.length > 0) {
          const strategyStore = {
            setNodes: (nodes: Node[]) => {},
            setEdges: (edges: any[]) => {},
            addHistoryItem: (nodes: Node[], edges: any[]) => {},
          };
          
          strategyStore.setNodes?.(updatedNodes);
          strategyStore.setEdges?.(updatedEdges);
          strategyStore.addHistoryItem?.(updatedNodes, updatedEdges);
        }
      }, 100);
    };
    
    return handleReEntryDisabled(node, id, data, edges, updateNodeData, setNodes, setEdges, addToStore);
  }
  
  return false;
}
