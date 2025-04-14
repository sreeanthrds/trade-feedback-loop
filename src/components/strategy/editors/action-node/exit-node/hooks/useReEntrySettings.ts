
import { useCallback, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../types';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';

interface UseReEntrySettingsProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  nodeData: any;
  defaultExitNodeData: ExitNodeData;
}

export const useReEntrySettings = ({
  node,
  updateNodeData,
  nodeData,
  defaultExitNodeData
}: UseReEntrySettingsProps) => {
  // Get all nodes to find nodes in the same group
  const nodes = useStrategyStore(state => state.nodes);
  
  // Extract re-entry config from node data
  const exitNodeData = nodeData?.exitNodeData as ExitNodeData || defaultExitNodeData;
  const reEntryConfig = exitNodeData.reEntryConfig || { enabled: false, groupNumber: 1, maxReEntries: 1 };
  const reEntryEnabled = reEntryConfig.enabled || false;
  
  // Sync with other nodes in the same group when changes are made
  useEffect(() => {
    if (!reEntryEnabled) return;
    
    const currentGroup = reEntryConfig.groupNumber;
    const currentMaxReEntries = reEntryConfig.maxReEntries;
    
    if (currentGroup === undefined || currentMaxReEntries === undefined) return;
    
    // Find all nodes with the same group number (both exit nodes and retry nodes)
    const exitNodesInGroup = nodes.filter(n => {
      if (n.id === node.id) return false; // Skip current node
      if (n.type !== 'exitNode') return false;
      
      const nData = n.data as { exitNodeData?: ExitNodeData };
      return nData.exitNodeData?.reEntryConfig?.enabled && 
             nData.exitNodeData?.reEntryConfig?.groupNumber === currentGroup;
    });
    
    const retryNodesInGroup = nodes.filter(n => {
      if (n.type !== 'retryNode') return false;
      
      const nData = n.data as { retryConfig?: { groupNumber?: number } };
      return nData.retryConfig?.groupNumber === currentGroup;
    });
    
    // If we have nodes in the same group, check if we need to sync maxReEntries
    if (exitNodesInGroup.length > 0 || retryNodesInGroup.length > 0) {
      let groupMaxReEntries: number | undefined;
      
      // First, check exit nodes
      for (const exitNode of exitNodesInGroup) {
        const nData = exitNode.data as { exitNodeData?: ExitNodeData };
        if (nData.exitNodeData?.reEntryConfig?.maxReEntries !== undefined) {
          groupMaxReEntries = nData.exitNodeData.reEntryConfig.maxReEntries;
          break;
        }
      }
      
      // If no value from exit nodes, check retry nodes
      if (groupMaxReEntries === undefined && retryNodesInGroup.length > 0) {
        for (const retryNode of retryNodesInGroup) {
          const nData = retryNode.data as { retryConfig?: { maxReEntries?: number } };
          if (nData.retryConfig?.maxReEntries !== undefined) {
            groupMaxReEntries = nData.retryConfig.maxReEntries;
            break;
          }
        }
      }
      
      // If we found a group value and it's different from our current value, update our node
      if (groupMaxReEntries !== undefined && groupMaxReEntries !== currentMaxReEntries) {
        console.log(`Exit node ${node.id} adopting maxReEntries ${groupMaxReEntries} from group ${currentGroup}`);
        
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
      }
    }
  }, [nodes, node.id, reEntryEnabled, reEntryConfig, nodeData, exitNodeData, updateNodeData]);
  
  // Handler for toggling re-entry
  const handleReEntryToggle = useCallback((enabled: boolean) => {
    const currentExitNodeData = (node.data?.exitNodeData as ExitNodeData) || defaultExitNodeData;
    const currentConfig = currentExitNodeData.reEntryConfig || { 
      enabled: false, 
      groupNumber: 1, 
      maxReEntries: 1 
    };
    
    // Update re-entry config
    const updatedConfig = {
      ...currentConfig,
      enabled
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...node.data,
      exitNodeData: {
        ...currentExitNodeData,
        reEntryConfig: updatedConfig
      }
    });
    
    // If enabling, sync with other nodes in the same group
    if (enabled) {
      const currentGroup = updatedConfig.groupNumber;
      
      // Check for existing nodes in the same group
      const nodesInSameGroup = nodes.filter(n => {
        if (n.id === node.id) return false;
        
        if (n.type === 'exitNode') {
          const nData = n.data as { exitNodeData?: ExitNodeData };
          return nData.exitNodeData?.reEntryConfig?.enabled && 
                nData.exitNodeData?.reEntryConfig?.groupNumber === currentGroup;
        } else if (n.type === 'retryNode') {
          const nData = n.data as { retryConfig?: { groupNumber?: number } };
          return nData.retryConfig?.groupNumber === currentGroup;
        }
        
        return false;
      });
      
      // If we found nodes in the same group, adopt their maxReEntries
      if (nodesInSameGroup.length > 0) {
        const firstNode = nodesInSameGroup[0];
        let groupMaxReEntries: number | undefined;
        
        if (firstNode.type === 'exitNode') {
          const nData = firstNode.data as { exitNodeData?: ExitNodeData };
          groupMaxReEntries = nData.exitNodeData?.reEntryConfig?.maxReEntries;
        } else if (firstNode.type === 'retryNode') {
          const nData = firstNode.data as { retryConfig?: { maxReEntries?: number } };
          groupMaxReEntries = nData.retryConfig?.maxReEntries;
        }
        
        if (groupMaxReEntries !== undefined && groupMaxReEntries !== updatedConfig.maxReEntries) {
          console.log(`New exit node ${node.id} adopting maxReEntries ${groupMaxReEntries} from group ${currentGroup}`);
          
          // Update with the group's maxReEntries
          updateNodeData(node.id, {
            ...node.data,
            exitNodeData: {
              ...currentExitNodeData,
              reEntryConfig: {
                ...updatedConfig,
                maxReEntries: groupMaxReEntries
              }
            }
          });
        }
      }
    }
  }, [node, defaultExitNodeData, updateNodeData, nodes]);
  
  return {
    reEntryEnabled,
    handleReEntryToggle
  };
};
