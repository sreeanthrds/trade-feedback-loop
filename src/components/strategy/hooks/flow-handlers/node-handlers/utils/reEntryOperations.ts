
import { Node } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { ExitNodeData } from '../types';

/**
 * Create a retry node when re-entry is enabled on an exit node
 */
export function createRetryNode(
  exitNode: Node, 
  groupNumber: number,
  maxReEntries: number
): Node {
  if (!exitNode) return null;
  
  const exitNodePosition = exitNode.position;
  
  // Create a retry node floating to the left of the exit node
  const retryNodeId = `retry-${uuidv4().substring(0, 6)}`;
  
  return {
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
        groupNumber: groupNumber || 1,
        maxReEntries: maxReEntries || 1
      }
    }
  };
}

/**
 * Create connecting edges between exit node, retry node, and entry node
 */
export function createRetryEdges(
  exitNodeId: string,
  retryNodeId: string,
  entryNodes: Node[]
) {
  // Create regular edge from exit node to retry node
  const connectingEdge = {
    id: `e-${exitNodeId}-${retryNodeId}`,
    source: exitNodeId,
    target: retryNodeId,
    style: { 
      stroke: '#9b59b6', 
      strokeWidth: 2 
    },
    sourceHandle: null,
    targetHandle: null
  };
  
  let dashEdge = null;
  
  // Connect to the first entry node with a dashed animated edge if available
  if (entryNodes.length > 0) {
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
  
  return { connectingEdge, dashEdge };
}

/**
 * Handles enabling re-entry for an exit node
 */
export function handleReEntryEnabled(
  node: Node,
  id: string, 
  data: any,
  nodes: Node[],
  updateNodeData: (id: string, data: any) => void,
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: any[] | ((eds: any[]) => any[])) => void,
  addToStore: (updatedNodes: Node[], updatedEdges: any[]) => void
): boolean {
  // Extract re-entry configuration
  const exitNodeData = data.exitNodeData;
  const newConfig = exitNodeData?.reEntryConfig;
  
  // Verify we have valid data
  if (!newConfig || !newConfig.enabled || !node) {
    return false;
  }
  
  console.log('Re-entry was enabled, creating retry node');
  
  // Create the retry node
  const retryNode = createRetryNode(
    node, 
    newConfig.groupNumber || 1, 
    newConfig.maxReEntries || 1
  );
  
  if (!retryNode) return false;
  
  // Find any entry nodes to connect with
  const entryNodes = nodes.filter(n => n.type === 'entryNode');
  
  // Create the edges
  const { connectingEdge, dashEdge } = createRetryEdges(id, retryNode.id, entryNodes);
  
  // Update node data first with reference to retry node
  updateNodeData(id, {
    ...data,
    linkedRetryNodeId: retryNode.id
  });
  
  // Then add the retry node and edges
  setNodes((prev: Node[]) => [...prev, retryNode]);
  
  // Add edges (both connecting and dashed if available)
  if (dashEdge) {
    setEdges((prev: any[]) => [...prev, connectingEdge, dashEdge]);
  } else {
    setEdges((prev: any[]) => [...prev, connectingEdge]);
  }
  
  // Prepare data for store update
  setTimeout(() => {
    const updatedNodes = [...nodes, retryNode];
    let updatedEdges = [...(dashEdge ? [connectingEdge, dashEdge] : [connectingEdge])];
    
    addToStore(updatedNodes, updatedEdges);
  }, 100);
  
  return true;
}

/**
 * Handles disabling re-entry for an exit node
 */
export function handleReEntryDisabled(
  node: Node,
  id: string,
  data: any,
  edges: any[],
  updateNodeData: (id: string, data: any) => void,
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: any[] | ((eds: any[]) => any[])) => void,
  addToStore: (updatedNodes: Node[], updatedEdges: any[]) => void
): boolean {
  // Check if node has a linked retry node
  const linkedRetryNodeId = node?.data?.linkedRetryNodeId;
  
  if (!linkedRetryNodeId) {
    return false;
  }
  
  console.log('Re-entry was disabled, removing retry node');
  
  // Find all edges connected to the retry node
  const edgesToRemove = edges.filter(edge => 
    edge.source === linkedRetryNodeId || edge.target === linkedRetryNodeId
  );
  
  // Get edge IDs to remove
  const edgeIdsToRemove = edgesToRemove.map(edge => edge.id);
  
  // First update the node data
  updateNodeData(id, {
    ...data,
    linkedRetryNodeId: undefined  // Clear the reference to retry node
  });
  
  // Remove the retry node
  setNodes((prev: Node[]) => prev.filter(n => n.id !== linkedRetryNodeId));
  
  // Remove related edges
  setEdges((prev: any[]) => prev.filter(e => !edgeIdsToRemove.includes(e.id)));
  
  // Update store
  setTimeout(() => {
    const updatedNodes = node.data.nodesRef?.current.filter(n => n.id !== linkedRetryNodeId) || [];
    const updatedEdges = edges.filter(e => !edgeIdsToRemove.includes(e.id));
    
    addToStore(updatedNodes, updatedEdges);
  }, 100);
  
  return true;
}
