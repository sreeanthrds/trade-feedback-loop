import { Node } from '@xyflow/react';
import { createUpdateNodeDataHandler } from '../../../../utils/handlers';

/**
 * Creates a retry node when a re-entry toggle is enabled
 */
export const createRetryNodeForReEntry = (
  nodeId: string,
  groupNumber: number,
  maxReEntries: number,
  data: any,
  nodes: Node[],
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: any[] | ((eds: any[]) => any[])) => void,
  syncTimeoutRef: React.MutableRefObject<number | null>
) => {
  // Implementation details for creating a retry node
  console.log(`Creating retry node for exit node ${nodeId}, group ${groupNumber}`);
  
  // Clear any pending timeout to avoid race conditions
  if (syncTimeoutRef.current !== null) {
    clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = null;
  }
  
  // Find the exit node
  const exitNode = nodes.find(n => n.id === nodeId);
  if (!exitNode) return;
  
  // Generate a unique ID for the retry node
  const retryNodeId = `retry-${nodeId}-${Date.now()}`;
  
  // Create the retry node
  const retryNode = {
    id: retryNodeId,
    type: 'retryNode',
    position: {
      x: exitNode.position.x + 150,
      y: exitNode.position.y + 50
    },
    data: {
      label: 'Re-entry',
      actionType: 'entry',
      _actionTypeInternal: 'retry',
      retryConfig: {
        groupNumber,
        maxReEntries
      },
      _lastUpdated: Date.now()
    }
  };
  
  // Create an edge from the exit node to the retry node
  const newEdge = {
    id: `edge-${nodeId}-${retryNodeId}`,
    source: nodeId,
    target: retryNodeId,
    type: 'default'
  };
  
  // Update the nodes and edges
  setNodes(nds => [...nds, retryNode]);
  setEdges(eds => [...eds, newEdge]);
  
  // Link the retry node to the exit node
  const updatedExitNodeData = {
    ...data,
    linkedRetryNodeId: retryNodeId,
    _lastUpdated: Date.now()
  };
  
  // Update the exit node data
  const handler = createUpdateNodeDataHandler(nodes, setNodes, { nodes, edges: [] });
  handler(nodeId, updatedExitNodeData);
};

/**
 * Removes a retry node when a re-entry toggle is disabled
 */
export const removeRetryNodeForReEntry = (
  exitNodeId: string,
  linkedRetryNodeId: string | undefined,
  nodes: Node[],
  edges: any[],
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: any[] | ((eds: any[]) => any[])) => void,
  syncTimeoutRef: React.MutableRefObject<number | null>
) => {
  // Implementation details for removing a retry node
  console.log(`Removing retry node ${linkedRetryNodeId} for exit node ${exitNodeId}`);
  
  // Clear any pending timeout to avoid race conditions
  if (syncTimeoutRef.current !== null) {
    clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = null;
  }
  
  if (!linkedRetryNodeId) return;
  
  // Remove the retry node
  setNodes(nds => nds.filter(n => n.id !== linkedRetryNodeId));
  
  // Remove any edges connected to the retry node
  setEdges(eds => eds.filter(e => 
    e.source !== linkedRetryNodeId && e.target !== linkedRetryNodeId
  ));
  
  // Update the exit node to remove the link
  const exitNode = nodes.find(n => n.id === exitNodeId);
  if (exitNode) {
    const handler = createUpdateNodeDataHandler(nodes, setNodes, { nodes, edges });
    const updatedData = {
      ...exitNode.data,
      linkedRetryNodeId: undefined,
      _lastUpdated: Date.now()
    };
    handler(exitNodeId, updatedData);
  }
};

/**
 * Synchronizes the retry node configuration with its exit node
 */
export const syncRetryNodeWithExitNode = (
  exitNodeId: string,
  retryNodeId: string,
  exitNodeData: any,
  nodes: Node[],
  updateNodeData: (id: string, data: any) => void,
  syncTimeoutRef: React.MutableRefObject<number | null>
) => {
  // Implementation details for synchronizing nodes
  console.log(`Syncing retry node ${retryNodeId} with exit node ${exitNodeId}`);
  
  // Clear any pending timeout to avoid race conditions
  if (syncTimeoutRef.current !== null) {
    clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = null;
  }
  
  // Find the retry node
  const retryNode = nodes.find(n => n.id === retryNodeId);
  if (!retryNode) return;
  
  // Get the re-entry configuration from the exit node
  const reEntryConfig = exitNodeData.exitNodeData?.reEntryConfig;
  if (!reEntryConfig) return;
  
  // Update the retry node with the same configuration
  updateNodeData(retryNodeId, {
    ...retryNode.data,
    retryConfig: {
      groupNumber: reEntryConfig.groupNumber,
      maxReEntries: reEntryConfig.maxReEntries
    },
    _lastUpdated: Date.now()
  });
  
  // Schedule a delayed sync to ensure consistency
  syncTimeoutRef.current = window.setTimeout(() => {
    syncTimeoutRef.current = null;
  }, 200);
};
