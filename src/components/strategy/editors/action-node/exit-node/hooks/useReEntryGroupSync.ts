
import { useCallback } from 'react';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';

/**
 * Hook for re-entry group synchronization
 */
export const useReEntryGroupSync = () => {
  const nodes = useStrategyStore(state => state.nodes);
  
  /**
   * Get the latest group number from all exit nodes
   */
  const getLatestGroupNumber = useCallback(() => {
    let highestGroupNumber = 0;
    
    // Find the highest group number in all exit nodes
    nodes.forEach(node => {
      if (node.data && node.data.exitNodeData && 
          node.data.exitNodeData.reEntryConfig && 
          node.data.exitNodeData.reEntryConfig.enabled) {
        const groupNumber = node.data.exitNodeData.reEntryConfig.groupNumber;
        if (typeof groupNumber === 'number' && groupNumber > highestGroupNumber) {
          highestGroupNumber = groupNumber;
        }
      }
    });
    
    return highestGroupNumber + 1;
  }, [nodes]);
  
  /**
   * Get the latest max re-entries from a specific group
   */
  const getLatestGroupMaxReEntries = useCallback((currentMaxReEntries: number) => {
    // Start with current value or 1
    let highestMaxReEntries = currentMaxReEntries || 1;
    
    // Find nodes with the same group number
    nodes.forEach(node => {
      if (node.data && node.data.exitNodeData && 
          node.data.exitNodeData.reEntryConfig && 
          node.data.exitNodeData.reEntryConfig.enabled) {
        const maxReEntries = node.data.exitNodeData.reEntryConfig.maxReEntries;
        if (typeof maxReEntries === 'number' && maxReEntries > highestMaxReEntries) {
          highestMaxReEntries = maxReEntries;
        }
      }
    });
    
    return highestMaxReEntries;
  }, [nodes]);
  
  /**
   * Synchronize with an existing group
   */
  const syncWithExistingGroup = useCallback((groupNumber: number) => {
    let maxReEntries = 1;
    let foundGroup = false;
    
    // Find nodes with the same group number
    nodes.forEach(node => {
      if (node.data && node.data.exitNodeData && 
          node.data.exitNodeData.reEntryConfig && 
          node.data.exitNodeData.reEntryConfig.enabled &&
          node.data.exitNodeData.reEntryConfig.groupNumber === groupNumber) {
        foundGroup = true;
        const nodeMaxReEntries = node.data.exitNodeData.reEntryConfig.maxReEntries;
        if (typeof nodeMaxReEntries === 'number' && nodeMaxReEntries > maxReEntries) {
          maxReEntries = nodeMaxReEntries;
        }
      }
    });
    
    return { 
      found: foundGroup, 
      maxReEntries 
    };
  }, [nodes]);
  
  /**
   * Synchronize group max re-entries across all nodes in the group
   */
  const syncGroupMaxReEntries = useCallback((groupNumber: number, maxReEntries: number) => {
    // This function would update all nodes in the same group
    // For now, this is a placeholder as we would need node update logic
    // which should be handled in a different place
    console.log(`Syncing group ${groupNumber} to max re-entries: ${maxReEntries}`);
    
    // Return all nodes that belong to this group
    return nodes.filter(node => 
      node.data && 
      node.data.exitNodeData && 
      node.data.exitNodeData.reEntryConfig &&
      node.data.exitNodeData.reEntryConfig.enabled &&
      node.data.exitNodeData.reEntryConfig.groupNumber === groupNumber
    );
  }, [nodes]);
  
  return {
    getLatestGroupNumber,
    getLatestGroupMaxReEntries,
    syncWithExistingGroup,
    syncGroupMaxReEntries
  };
};
