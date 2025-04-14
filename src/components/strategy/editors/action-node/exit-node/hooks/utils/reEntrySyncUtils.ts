
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../../types';
import { LeaderNodeInfo, NodeWithReEntryConfig } from '../types/reEntryTypes';

/**
 * Finds all exit nodes that belong to the specified re-entry group
 */
export function findExitNodesInGroup(
  nodes: Node[],
  groupNumber: number,
  currentNodeId?: string
): Node[] {
  return nodes.filter(n => {
    if (currentNodeId && n.id === currentNodeId) return false;
    if (n.type !== 'exitNode') return false;
    
    const nData = n.data as { exitNodeData?: ExitNodeData };
    return nData.exitNodeData?.reEntryConfig?.enabled && 
           nData.exitNodeData?.reEntryConfig?.groupNumber === groupNumber;
  });
}

/**
 * Finds all retry nodes that belong to the specified re-entry group
 */
export function findRetryNodesInGroup(
  nodes: Node[],
  groupNumber: number,
  currentNodeId?: string
): Node[] {
  return nodes.filter(n => {
    if (currentNodeId && n.id === currentNodeId) return false;
    if (n.type !== 'retryNode') return false;
    
    const nData = n.data as { retryConfig?: { groupNumber?: number } };
    return nData.retryConfig?.groupNumber === groupNumber;
  });
}

/**
 * Finds the leader node of a group (the first node with maxReEntries defined)
 */
export function findGroupLeader(
  nodes: Node[],
  groupNumber: number,
  currentNodeId?: string
): LeaderNodeInfo | undefined {
  // First look in exit nodes
  const exitNodes = findExitNodesInGroup(nodes, groupNumber, currentNodeId);
  for (const node of exitNodes) {
    const nData = node.data as { exitNodeData?: ExitNodeData };
    if (nData.exitNodeData?.reEntryConfig?.maxReEntries !== undefined) {
      return {
        maxReEntries: nData.exitNodeData.reEntryConfig.maxReEntries,
        groupNumber,
        nodeId: node.id
      };
    }
  }
  
  // Then look in retry nodes
  const retryNodes = findRetryNodesInGroup(nodes, groupNumber, currentNodeId);
  for (const node of retryNodes) {
    const nData = node.data as { retryConfig?: { maxReEntries?: number } };
    if (nData.retryConfig?.maxReEntries !== undefined) {
      return {
        maxReEntries: nData.retryConfig.maxReEntries,
        groupNumber,
        nodeId: node.id
      };
    }
  }
  
  return undefined;
}

/**
 * Gets the maxReEntries value for a node
 */
export function getNodeMaxReEntries(node: NodeWithReEntryConfig): number | undefined {
  if (node.type === 'exitNode') {
    return node.data.exitNodeData?.reEntryConfig?.maxReEntries;
  } else if (node.type === 'retryNode') {
    return node.data.retryConfig?.maxReEntries;
  }
  return undefined;
}

/**
 * Gets the groupNumber value for a node
 */
export function getNodeGroupNumber(node: NodeWithReEntryConfig): number | undefined {
  if (node.type === 'exitNode') {
    return node.data.exitNodeData?.reEntryConfig?.groupNumber;
  } else if (node.type === 'retryNode') {
    return node.data.retryConfig?.groupNumber;
  }
  return undefined;
}

/**
 * Updates an exit node's maxReEntries value
 */
export function updateExitNodeMaxReEntries(
  exitNode: Node,
  maxReEntries: number,
  updateNodeData: (id: string, data: any) => void
): void {
  const nData = exitNode.data as { exitNodeData?: ExitNodeData };
  if (nData.exitNodeData?.reEntryConfig?.maxReEntries !== maxReEntries) {
    console.log(`Syncing node ${exitNode.id} maxReEntries to ${maxReEntries}`);
    updateNodeData(exitNode.id, {
      ...exitNode.data,
      exitNodeData: {
        ...nData.exitNodeData,
        reEntryConfig: {
          ...nData.exitNodeData?.reEntryConfig,
          maxReEntries
        }
      }
    });
  }
}

/**
 * Updates a retry node's maxReEntries value
 */
export function updateRetryNodeMaxReEntries(
  retryNode: Node,
  maxReEntries: number,
  updateNodeData: (id: string, data: any) => void
): void {
  const nData = retryNode.data as { retryConfig?: { maxReEntries?: number } };
  if (nData.retryConfig?.maxReEntries !== maxReEntries) {
    console.log(`Syncing retry node ${retryNode.id} maxReEntries to ${maxReEntries}`);
    updateNodeData(retryNode.id, {
      ...retryNode.data,
      retryConfig: {
        ...nData.retryConfig,
        maxReEntries
      }
    });
  }
}
