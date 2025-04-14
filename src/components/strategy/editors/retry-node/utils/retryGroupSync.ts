
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../../action-node/exit-node/types';

/**
 * Finds all nodes that belong to the same re-entry group
 */
export const findNodesInSameGroup = (
  nodes: Node[],
  groupNumber: number,
  currentNodeId: string
): Node[] => {
  return nodes.filter(n => {
    if (n.id === currentNodeId) return false;
    
    if (n.type === 'exitNode') {
      const nData = n.data as { exitNodeData?: ExitNodeData };
      return nData.exitNodeData?.reEntryConfig?.enabled && 
             nData.exitNodeData?.reEntryConfig?.groupNumber === groupNumber;
    } else if (n.type === 'retryNode') {
      const nData = n.data as { retryConfig?: { groupNumber?: number } };
      return nData.retryConfig?.groupNumber === groupNumber;
    }
    
    return false;
  });
};

/**
 * Gets the maxReEntries value from an exit node
 */
export const getExitNodeMaxReEntries = (node: Node): number | undefined => {
  const nData = node.data as { exitNodeData?: ExitNodeData };
  return nData.exitNodeData?.reEntryConfig?.maxReEntries;
};

/**
 * Gets the maxReEntries value from a retry node
 */
export const getRetryNodeMaxReEntries = (node: Node): number | undefined => {
  const nData = node.data as { retryConfig?: { maxReEntries?: number } };
  return nData.retryConfig?.maxReEntries;
};

/**
 * Gets the next available group number for a new retry node
 */
export const getNextAvailableGroupNumber = (nodes: Node[]): number => {
  const allGroupNumbers = new Set<number>();
  
  // Collect all existing group numbers
  nodes.forEach(n => {
    if (n.type === 'exitNode') {
      const nData = n.data as { exitNodeData?: ExitNodeData };
      if (nData.exitNodeData?.reEntryConfig?.enabled && 
          nData.exitNodeData?.reEntryConfig?.groupNumber !== undefined) {
        allGroupNumbers.add(nData.exitNodeData.reEntryConfig.groupNumber);
      }
    } else if (n.type === 'retryNode') {
      const nData = n.data as { retryConfig?: { groupNumber?: number } };
      if (nData.retryConfig?.groupNumber !== undefined) {
        allGroupNumbers.add(nData.retryConfig.groupNumber);
      }
    }
  });
  
  // Find the first unused group number
  let groupNumber = 1;
  while (allGroupNumbers.has(groupNumber)) {
    groupNumber++;
  }
  
  return groupNumber;
};
