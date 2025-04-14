
import { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData, ReEntryConfig } from '../../types';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { findNodesInSameGroup } from './reEntryGroupUtils';

interface UseReEntryGroupManagementProps {
  node: Node;
  reEntryEnabled: boolean;
  reEntryConfig: ReEntryConfig;
  nodeData: any;
  exitNodeData: ExitNodeData;
  updateNodeData: (id: string, data: any) => void;
  updatingRef: React.MutableRefObject<boolean>;
}

/**
 * Hook to manage synchronization between nodes in the same re-entry group
 */
export const useReEntryGroupManagement = ({
  node,
  reEntryEnabled,
  reEntryConfig,
  nodeData,
  exitNodeData,
  updateNodeData,
  updatingRef
}: UseReEntryGroupManagementProps) => {
  // Get all nodes to find nodes in the same group
  const nodes = useStrategyStore(state => state.nodes);
  
  // Sync with other nodes in the same group when changes are made
  useEffect(() => {
    if (!reEntryEnabled || updatingRef.current) return;
    
    const currentGroup = reEntryConfig.groupNumber;
    const currentMaxReEntries = reEntryConfig.maxReEntries;
    
    if (currentGroup === undefined || currentMaxReEntries === undefined) return;
    
    // Find nodes in the same group
    const nodesInSameGroup = findNodesInSameGroup(nodes, currentGroup, node.id);
    
    // If we have nodes in the same group, check if we need to sync maxReEntries
    if (nodesInSameGroup.length > 0) {
      let groupMaxReEntries: number | undefined;
      
      // Find the first node with a defined maxReEntries value
      for (const groupNode of nodesInSameGroup) {
        const maxReEntries = getNodeMaxReEntries(groupNode);
        if (maxReEntries !== undefined) {
          groupMaxReEntries = maxReEntries;
          break;
        }
      }
      
      // If we found a group value and it's different from our current value, update our node
      if (groupMaxReEntries !== undefined && groupMaxReEntries !== currentMaxReEntries) {
        console.log(`Exit node ${node.id} adopting maxReEntries ${groupMaxReEntries} from group ${currentGroup}`);
        
        updatingRef.current = true;
        updateNodeData(node.id, {
          ...nodeData,
          exitNodeData: {
            ...exitNodeData,
            reEntryConfig: {
              ...reEntryConfig,
              maxReEntries: groupMaxReEntries
            }
          }
        });
        
        setTimeout(() => {
          updatingRef.current = false;
        }, 150);
      }
    }
  }, [nodes, node.id, reEntryEnabled, reEntryConfig, nodeData, exitNodeData, updateNodeData, updatingRef]);
};

/**
 * Extracts the maxReEntries value from a node
 */
function getNodeMaxReEntries(node: Node): number | undefined {
  if (node.type === 'exitNode') {
    const nData = node.data as { exitNodeData?: ExitNodeData };
    return nData.exitNodeData?.reEntryConfig?.maxReEntries;
  } else if (node.type === 'retryNode') {
    const nData = node.data as { retryConfig?: { maxReEntries?: number } };
    return nData.retryConfig?.maxReEntries;
  }
  return undefined;
}
