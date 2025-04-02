
import { Node } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { ExitNodeData } from '../types';

interface UseReEntryGroupSyncProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  groupNumber: number;
  reEntryEnabled: boolean;
}

export const useReEntryGroupSync = ({
  node,
  updateNodeData,
  groupNumber,
  reEntryEnabled
}: UseReEntryGroupSyncProps) => {
  // Get all nodes for group syncing
  const allNodes = useStrategyStore(state => state.nodes);
  
  // Sync with existing group if changing to a group that already exists
  const syncWithExistingGroup = (newGroupNumber: number, maxReEntries: number) => {
    if (newGroupNumber <= 0) return maxReEntries;
    
    // Find all exit nodes with the same group number
    const nodesInSameGroup = allNodes.filter(n => {
      if (n.type !== 'exitNode' || n.id === node.id) return false;
      const exitNodeData = n.data?.exitNodeData as ExitNodeData | undefined;
      return exitNodeData?.reEntryConfig?.enabled &&
             exitNodeData?.reEntryConfig?.groupNumber === newGroupNumber;
    });
    
    // If there are nodes in the same group, sync max re-entries with them
    if (nodesInSameGroup.length > 0) {
      const firstNodeData = nodesInSameGroup[0].data?.exitNodeData as ExitNodeData | undefined;
      const existingMaxReEntries = firstNodeData?.reEntryConfig?.maxReEntries || 3;
      return existingMaxReEntries;
    }
    
    // Return original max re-entries if no matching group found
    return maxReEntries;
  };
  
  // Sync all nodes in the same group when max re-entries changes
  const syncGroupMaxReEntries = (group: number, newMaxReEntries: number) => {
    if (group <= 0) return;
    
    // Find all exit nodes with the same group number
    const nodesInSameGroup = allNodes.filter(n => {
      if (n.type !== 'exitNode' || n.id === node.id) return false;
      const exitNodeData = n.data?.exitNodeData as ExitNodeData | undefined;
      return exitNodeData?.reEntryConfig?.enabled &&
             exitNodeData?.reEntryConfig?.groupNumber === group;
    });
    
    // Update all nodes in the same group
    nodesInSameGroup.forEach(otherNode => {
      const otherNodeData = otherNode.data || {};
      const otherExitNodeData = otherNodeData.exitNodeData as ExitNodeData | undefined || {};
      
      // Ensure reEntryConfig exists before spreading
      const otherReEntryConfig = otherExitNodeData.reEntryConfig || {};
      
      const updatedConfig = {
        ...otherReEntryConfig,
        maxReEntries: newMaxReEntries
      };
      
      const updatedExitNodeData = {
        ...otherExitNodeData,
        reEntryConfig: updatedConfig
      };
      
      updateNodeData(otherNode.id, {
        ...otherNodeData,
        exitNodeData: updatedExitNodeData,
        _lastUpdated: Date.now()
      });
    });
  };
  
  // Get latest max re-entries from other nodes in the same group
  const getLatestGroupMaxReEntries = (currentMaxReEntries: number): number => {
    if (!reEntryEnabled || groupNumber <= 0) return currentMaxReEntries;
    
    // Find all exit nodes with the same group number
    const nodesInSameGroup = allNodes.filter(n => {
      if (n.type !== 'exitNode' || n.id === node.id) return false;
      const exitNodeData = n.data?.exitNodeData as ExitNodeData | undefined;
      return exitNodeData?.reEntryConfig?.enabled &&
             exitNodeData?.reEntryConfig?.groupNumber === groupNumber;
    });
    
    // If there are nodes in the same group, check if max re-entries needs updating
    if (nodesInSameGroup.length > 0) {
      const sortedNodes = [...nodesInSameGroup].sort((a, b) => {
        const lastUpdatedA = a.data?._lastUpdated as number || 0;
        const lastUpdatedB = b.data?._lastUpdated as number || 0;
        return lastUpdatedB - lastUpdatedA;
      });
      
      const latestNodeInGroup = sortedNodes[0];
      const latestNodeData = latestNodeInGroup.data?.exitNodeData as ExitNodeData | undefined;
      const latestMaxReEntries = latestNodeData?.reEntryConfig?.maxReEntries;
      
      // Only return new value if it's different and defined
      if (latestMaxReEntries !== undefined && latestMaxReEntries !== currentMaxReEntries) {
        return latestMaxReEntries;
      }
    }
    
    return currentMaxReEntries;
  };
  
  return {
    syncWithExistingGroup,
    syncGroupMaxReEntries,
    getLatestGroupMaxReEntries
  };
};
