
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../../types';
import { NodeWithReEntryConfig } from '../types/reEntryTypes';
import { 
  findExitNodesInGroup,
  findRetryNodesInGroup,
  updateExitNodeMaxReEntries,
  updateRetryNodeMaxReEntries
} from './reEntrySyncUtils';

/**
 * Synchronizes maxReEntries for all nodes in the same group
 */
export function syncGroupMaxReEntries(
  nodes: Node[],
  groupNumber: number,
  maxReEntries: number,
  sourceNodeId: string,
  updateNodeData: (id: string, data: any) => void
): void {
  // Find all exit nodes in this group
  const exitNodesInGroup = findExitNodesInGroup(nodes, groupNumber, sourceNodeId);
  
  // Find all retry nodes in this group
  const retryNodesInGroup = findRetryNodesInGroup(nodes, groupNumber, sourceNodeId);
  
  // Update all exit nodes in group
  exitNodesInGroup.forEach(node => {
    updateExitNodeMaxReEntries(node, maxReEntries, updateNodeData);
  });
  
  // Update all retry nodes in group
  retryNodesInGroup.forEach(node => {
    updateRetryNodeMaxReEntries(node, maxReEntries, updateNodeData);
  });
}

/**
 * Handles the adoption of maxReEntries when a node joins a group
 */
export function adoptGroupMaxReEntries(
  node: NodeWithReEntryConfig,
  groupNumber: number, 
  leaderMaxReEntries: number,
  updateNodeData: (id: string, data: any) => void
): void {
  if (node.type === 'exitNode') {
    const exitNodeData = node.data.exitNodeData;
    if (exitNodeData?.reEntryConfig?.maxReEntries !== leaderMaxReEntries) {
      console.log(`Node ${node.id} adopting maxReEntries ${leaderMaxReEntries} from group ${groupNumber}`);
      updateNodeData(node.id, {
        ...node.data,
        exitNodeData: {
          ...exitNodeData,
          reEntryConfig: {
            ...exitNodeData.reEntryConfig,
            maxReEntries: leaderMaxReEntries
          }
        }
      });
    }
  } else if (node.type === 'retryNode') {
    const retryConfig = node.data.retryConfig;
    if (retryConfig?.maxReEntries !== leaderMaxReEntries) {
      console.log(`Retry node ${node.id} adopting maxReEntries ${leaderMaxReEntries} from group ${groupNumber}`);
      updateNodeData(node.id, {
        ...node.data,
        retryConfig: {
          ...retryConfig,
          maxReEntries: leaderMaxReEntries
        }
      });
    }
  }
}

/**
 * Gets the maximum re-entries value used across all nodes in a group
 */
export function getMaxReEntriesForGroup(
  nodes: Node[],
  groupNumber: number,
  defaultValue: number = 1
): number {
  const nodesInGroup = [
    ...findExitNodesInGroup(nodes, groupNumber),
    ...findRetryNodesInGroup(nodes, groupNumber)
  ];
  
  if (nodesInGroup.length === 0) return defaultValue;
  
  return Math.max(...nodesInGroup.map(n => {
    if (n.type === 'exitNode') {
      const nData = n.data as { exitNodeData?: ExitNodeData };
      return nData.exitNodeData?.reEntryConfig?.maxReEntries || defaultValue;
    } else if (n.type === 'retryNode') {
      const nData = n.data as { retryConfig?: { maxReEntries?: number } };
      return nData.retryConfig?.maxReEntries || defaultValue;
    }
    return defaultValue;
  }));
}
