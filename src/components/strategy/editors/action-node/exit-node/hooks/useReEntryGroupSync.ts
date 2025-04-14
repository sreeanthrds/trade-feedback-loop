
import { useEffect } from 'react';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { UseReEntryGroupSyncProps, NodeWithReEntryConfig } from './types/reEntryTypes';
import { 
  findGroupLeader,
  getNodeGroupNumber, 
  getNodeMaxReEntries 
} from './utils/reEntrySyncUtils';
import { 
  syncGroupMaxReEntries, 
  adoptGroupMaxReEntries,
  getMaxReEntriesForGroup
} from './utils/reEntrySyncOperations';

/**
 * Hook to synchronize maxReEntries across all nodes with the same reEntry group
 */
export const useReEntryGroupSync = (props?: UseReEntryGroupSyncProps) => {
  // Safe access to props with defaults
  const node = props?.node;
  const updateNodeData = props?.updateNodeData;
  const nodes = useStrategyStore(state => state.nodes);
  
  // Effect for synchronizing maxReEntries when an exit node changes
  useEffect(() => {
    // Skip if missing required props
    if (!node || !updateNodeData) return;
    
    // Only for exit nodes with enabled re-entry
    if (node.type === 'exitNode') {
      const typedNode = node as NodeWithReEntryConfig;
      const exitNodeData = typedNode.data.exitNodeData;
      
      if (exitNodeData?.reEntryConfig?.enabled) {
        const groupNumber = exitNodeData.reEntryConfig.groupNumber;
        const maxReEntries = exitNodeData.reEntryConfig.maxReEntries;
        
        if (groupNumber !== undefined && maxReEntries !== undefined) {
          // Synchronize maxReEntries with all nodes in the same group
          syncGroupMaxReEntries(nodes, groupNumber, maxReEntries, node.id, updateNodeData);
        }
      }
    }
  }, [node?.data, nodes, updateNodeData]);
  
  // Effect for adopting maxReEntries when joining a group
  useEffect(() => {
    if (!node || !updateNodeData) return;
    
    const typedNode = node as NodeWithReEntryConfig;
    let groupNumber: number | undefined;
    
    // Get group number based on node type
    if (node.type === 'exitNode') {
      const exitNodeData = typedNode.data.exitNodeData;
      if (!exitNodeData?.reEntryConfig?.enabled) return;
      groupNumber = exitNodeData.reEntryConfig.groupNumber;
    } else if (node.type === 'retryNode') {
      groupNumber = typedNode.data.retryConfig?.groupNumber;
    }
    
    if (groupNumber === undefined) return;
    
    // Find a leader node in the group to adopt maxReEntries from
    const groupLeader = findGroupLeader(nodes, groupNumber, node.id);
    
    if (groupLeader) {
      const currentMaxReEntries = getNodeMaxReEntries(typedNode);
      
      // If this node's maxReEntries differs from the group leader, adopt the leader's value
      if (currentMaxReEntries !== groupLeader.maxReEntries) {
        adoptGroupMaxReEntries(typedNode, groupNumber, groupLeader.maxReEntries, updateNodeData);
      }
    }
  }, [nodes, node?.id, node?.data, node?.type, updateNodeData]);
  
  // Effect for handling retry node updates
  useEffect(() => {
    if (!node || !updateNodeData || node.type !== 'retryNode') return;
    
    const typedNode = node as NodeWithReEntryConfig;
    const groupNumber = getNodeGroupNumber(typedNode);
    const maxReEntries = getNodeMaxReEntries(typedNode);
    
    if (groupNumber === undefined) return;
    
    // Find nodes in the same group
    const exitNodesInGroup = findGroupLeader(nodes, groupNumber, node.id);
    
    // If this node has a value and other nodes exist in the group
    if (maxReEntries !== undefined && exitNodesInGroup) {
      // Propagate this node's maxReEntries to the group
      syncGroupMaxReEntries(nodes, groupNumber, maxReEntries, node.id, updateNodeData);
    }
  }, [node?.type, node?.data, node?.id, nodes, updateNodeData]);
  
  // Helper utility to get the appropriate max re-entries for a group
  const getLatestGroupMaxReEntries = (defaultValue = 1): number => {
    if (!node) return defaultValue;
    
    const typedNode = node as NodeWithReEntryConfig;
    const groupNumber = getNodeGroupNumber(typedNode);
    
    if (groupNumber === undefined) return defaultValue;
    
    return getMaxReEntriesForGroup(nodes, groupNumber, defaultValue);
  };
  
  return {
    getLatestGroupMaxReEntries
  };
};
