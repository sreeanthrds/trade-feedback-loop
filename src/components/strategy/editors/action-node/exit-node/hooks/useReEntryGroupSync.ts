
import { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { ExitNodeData } from '../types';

interface UseReEntryGroupSyncProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  defaultExitNodeData: ExitNodeData;
}

export const useReEntryGroupSync = ({ 
  node, 
  updateNodeData, 
  defaultExitNodeData 
}: UseReEntryGroupSyncProps) => {
  const nodes = useStrategyStore(state => state.nodes);
  
  // Sync all nodes with the same reEntry group when one node changes
  useEffect(() => {
    // Safe access to exitNodeData with proper type casting and validation
    const nodeData = node.data as { exitNodeData?: ExitNodeData };
    const exitNodeData = nodeData.exitNodeData;

    // Only run sync if re-entry is enabled
    if (exitNodeData?.reEntryConfig?.enabled) {
      const currentGroup = exitNodeData?.reEntryConfig?.groupNumber;
      const maxReEntries = exitNodeData?.reEntryConfig?.maxReEntries;

      if (currentGroup !== undefined && maxReEntries !== undefined) {
        // Find all exit nodes with the same group number
        const groupNodes = nodes.filter(n => {
          if (n.id === node.id) return false; // Skip current node
          if (n.type !== 'exitNode') return false;
          
          const nData = n.data as { exitNodeData?: ExitNodeData };
          return nData.exitNodeData?.reEntryConfig?.enabled && 
                 nData.exitNodeData?.reEntryConfig?.groupNumber === currentGroup;
        });
        
        // Update maxReEntries for all nodes in the group
        groupNodes.forEach(n => {
          const nData = n.data as { exitNodeData?: ExitNodeData };
          if (nData.exitNodeData?.reEntryConfig?.maxReEntries !== maxReEntries) {
            updateNodeData(n.id, {
              ...n.data,
              exitNodeData: {
                ...nData.exitNodeData,
                reEntryConfig: {
                  ...nData.exitNodeData?.reEntryConfig,
                  maxReEntries
                }
              }
            });
          }
        });
      }
    }
  }, [node.data, nodes, updateNodeData]);
  
  // Update existing node config when a new node joins a group
  useEffect(() => {
    // Safe access to exitNodeData with proper type casting and validation
    const nodeData = node.data as { exitNodeData?: ExitNodeData };
    const exitNodeData = nodeData.exitNodeData;
    
    // Only run if re-entry is enabled and we have a valid group number
    if (exitNodeData?.reEntryConfig?.enabled && 
        exitNodeData?.reEntryConfig?.groupNumber !== undefined) {
      const currentGroup = exitNodeData.reEntryConfig.groupNumber;
      
      // Find other nodes in the same group
      const groupLeader = nodes.find(n => {
        if (n.id === node.id) return false; // Skip current node
        if (n.type !== 'exitNode') return false;
        
        const nData = n.data as { exitNodeData?: ExitNodeData };
        return nData.exitNodeData?.reEntryConfig?.enabled && 
               nData.exitNodeData?.reEntryConfig?.groupNumber === currentGroup;
      });
      
      // If a group leader is found, adopt its maxReEntries value
      if (groupLeader) {
        const leaderData = groupLeader.data as { exitNodeData?: ExitNodeData };
        const leaderMaxReEntries = leaderData.exitNodeData?.reEntryConfig?.maxReEntries;
        
        if (leaderMaxReEntries !== undefined && 
            exitNodeData.reEntryConfig.maxReEntries !== leaderMaxReEntries) {
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
      }
    }
  }, [nodes, node.id, updateNodeData]);
  
  return {};
};
