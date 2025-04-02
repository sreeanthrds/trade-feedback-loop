import { useEffect } from 'react';
import { Node } from '@xyflow/react';
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
  // Find the latest Max re-entries from other nodes in the same group
  const getLatestGroupMaxReEntries = (currentMaxReEntries: number): number => {
    // Skip if group sync is not relevant (group number is 0 or re-entry is disabled)
    if (groupNumber === 0 || !reEntryEnabled) {
      return currentMaxReEntries;
    }

    try {
      // Get all nodes from the flow
      const flowNodes = (window as any).__REACT_FLOW_NODES__;
      
      if (!flowNodes) {
        // Flow nodes not available yet, return current value
        return currentMaxReEntries;
      }
      
      // Find all exit nodes with the same group number
      const nodesInSameGroup = Object.values(flowNodes)
        .filter((flowNode: any) => {
          // Filter to exit nodes only
          if (!flowNode || flowNode.type !== 'exitNode') {
            return false;
          }
          
          // Skip current node to avoid circular updates
          if (flowNode.id === node.id) {
            return false;
          }
          
          // Check if this node has the same group number and enabled re-entry
          const nodeData = flowNode.data || {};
          // Use safer type checking with optional chaining
          const exitNodeData = nodeData.exitNodeData as ExitNodeData | undefined;
          
          return exitNodeData?.reEntryConfig?.enabled && 
                 exitNodeData?.reEntryConfig?.groupNumber === groupNumber;
        });
        
      if (nodesInSameGroup.length === 0) {
        // No other nodes in this group, keep current value
        return currentMaxReEntries;
      }
      
      // Find the highest max re-entries value in the group
      let highestMax = currentMaxReEntries;
      
      nodesInSameGroup.forEach((otherNode: any) => {
        // Safely access re-entry config from other nodes
        const exitNodeData = otherNode?.data?.exitNodeData as ExitNodeData | undefined;
        if (exitNodeData && typeof exitNodeData.reEntryConfig?.maxReEntries === 'number') {
          if (exitNodeData.reEntryConfig.maxReEntries > highestMax) {
            highestMax = exitNodeData.reEntryConfig.maxReEntries;
          }
        }
      });
      
      return highestMax;
    } catch (error) {
      console.error("Error finding group max re-entries:", error);
      // Fallback to current value if there's an error
      return currentMaxReEntries;
    }
  };

  return {
    getLatestGroupMaxReEntries
  };
};
