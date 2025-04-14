
import { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { ExitNodeData } from '../types';

interface UseReEntryGroupSyncProps {
  node?: Node;
  updateNodeData?: (id: string, data: any) => void;
  defaultExitNodeData?: ExitNodeData;
}

export const useReEntryGroupSync = (props?: UseReEntryGroupSyncProps) => {
  // Safe access to props with defaults
  const node = props?.node;
  const updateNodeData = props?.updateNodeData;
  const defaultExitNodeData = props?.defaultExitNodeData;
  
  const nodes = useStrategyStore(state => state.nodes);
  
  // Sync all nodes with the same reEntry group when one node changes
  useEffect(() => {
    // Only run if we have all required props
    if (!node || !updateNodeData) return;

    // Safe access to exitNodeData with proper type casting and validation
    const nodeData = node.data as { exitNodeData?: ExitNodeData };
    const exitNodeData = nodeData?.exitNodeData;

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
        
        // Also check retry nodes with the same group number
        const retryNodes = nodes.filter(n => {
          if (n.type !== 'retryNode') return false;
          
          const nData = n.data as { retryConfig?: { groupNumber?: number } };
          return nData.retryConfig?.groupNumber === currentGroup;
        });
        
        // Update maxReEntries for all nodes in the group
        groupNodes.forEach(n => {
          const nData = n.data as { exitNodeData?: ExitNodeData };
          if (nData.exitNodeData?.reEntryConfig?.maxReEntries !== maxReEntries) {
            console.log(`Syncing node ${n.id} maxReEntries to ${maxReEntries} from group ${currentGroup}`);
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
        
        // Update retryNodes maxReEntries to match as well
        retryNodes.forEach(n => {
          const nData = n.data as { retryConfig?: { groupNumber?: number, maxReEntries?: number } };
          if (nData.retryConfig?.maxReEntries !== maxReEntries) {
            console.log(`Syncing retry node ${n.id} maxReEntries to ${maxReEntries} from group ${currentGroup}`);
            updateNodeData(n.id, {
              ...n.data,
              retryConfig: {
                ...nData.retryConfig,
                maxReEntries
              }
            });
          }
        });
      }
    }
  }, [node?.data, nodes, updateNodeData]);
  
  // Update existing node config when a new node joins a group
  useEffect(() => {
    // Only run if we have all required props
    if (!node || !updateNodeData) return;

    // Safe access to exitNodeData with proper type casting and validation
    const nodeData = node.data as { exitNodeData?: ExitNodeData };
    const exitNodeData = nodeData?.exitNodeData;
    
    // Only run if re-entry is enabled and we have a valid group number
    if (exitNodeData?.reEntryConfig?.enabled && 
        exitNodeData?.reEntryConfig?.groupNumber !== undefined) {
      const currentGroup = exitNodeData.reEntryConfig.groupNumber;
      
      // Find other nodes in the same group (both exit nodes and retry nodes)
      const groupLeader = nodes.find(n => {
        if (n.id === node.id) return false; // Skip current node
        
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
      
      // If a group leader is found, adopt its maxReEntries value
      if (groupLeader) {
        let leaderMaxReEntries: number | undefined;
        
        if (groupLeader.type === 'exitNode') {
          const leaderData = groupLeader.data as { exitNodeData?: ExitNodeData };
          leaderMaxReEntries = leaderData.exitNodeData?.reEntryConfig?.maxReEntries;
        } else if (groupLeader.type === 'retryNode') {
          const leaderData = groupLeader.data as { retryConfig?: { maxReEntries?: number } };
          leaderMaxReEntries = leaderData.retryConfig?.maxReEntries;
        }
        
        if (leaderMaxReEntries !== undefined && 
            exitNodeData.reEntryConfig.maxReEntries !== leaderMaxReEntries) {
          console.log(`New node ${node.id} adopting maxReEntries ${leaderMaxReEntries} from group ${currentGroup}`);
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
  }, [nodes, node?.id, node?.data, updateNodeData]);

  // Update RetryNodes when they're added or modified
  useEffect(() => {
    if (!node || !updateNodeData) return;
    
    // Only care about retry nodes in this effect
    if (node.type !== 'retryNode') return;
    
    const nodeData = node.data as { retryConfig?: { groupNumber?: number, maxReEntries?: number } };
    const groupNumber = nodeData?.retryConfig?.groupNumber;
    const maxReEntries = nodeData?.retryConfig?.maxReEntries;
    
    if (groupNumber === undefined) return;
    
    // Find any exit nodes in the same group
    const exitNodesInGroup = nodes.filter(n => {
      if (n.type !== 'exitNode') return false;
      
      const nData = n.data as { exitNodeData?: ExitNodeData };
      return nData.exitNodeData?.reEntryConfig?.enabled && 
             nData.exitNodeData?.reEntryConfig?.groupNumber === groupNumber;
    });
    
    // Find other retry nodes in the same group
    const retryNodesInGroup = nodes.filter(n => {
      if (n.id === node.id) return false; // Skip current node
      if (n.type !== 'retryNode') return false;
      
      const nData = n.data as { retryConfig?: { groupNumber?: number } };
      return nData.retryConfig?.groupNumber === groupNumber;
    });
    
    if (exitNodesInGroup.length > 0 || retryNodesInGroup.length > 0) {
      // First, check if we need to adopt a max re-entries value from existing nodes
      let existingMaxReEntries: number | undefined;
      
      // Check exit nodes first
      for (const exitNode of exitNodesInGroup) {
        const nData = exitNode.data as { exitNodeData?: ExitNodeData };
        if (nData.exitNodeData?.reEntryConfig?.maxReEntries !== undefined) {
          existingMaxReEntries = nData.exitNodeData.reEntryConfig.maxReEntries;
          break;
        }
      }
      
      // If no value found from exit nodes, check other retry nodes
      if (existingMaxReEntries === undefined && retryNodesInGroup.length > 0) {
        for (const retryNode of retryNodesInGroup) {
          const nData = retryNode.data as { retryConfig?: { maxReEntries?: number } };
          if (nData.retryConfig?.maxReEntries !== undefined) {
            existingMaxReEntries = nData.retryConfig.maxReEntries;
            break;
          }
        }
      }
      
      // If this node has a different maxReEntries than the group, adopt the group's value
      if (existingMaxReEntries !== undefined && maxReEntries !== existingMaxReEntries) {
        console.log(`Retry node ${node.id} adopting maxReEntries ${existingMaxReEntries} from group ${groupNumber}`);
        updateNodeData(node.id, {
          ...node.data,
          retryConfig: {
            ...nodeData.retryConfig,
            maxReEntries: existingMaxReEntries
          }
        });
      }
      // If this node has a value and others don't (or they're different), propagate this node's value
      else if (maxReEntries !== undefined) {
        // Update exit nodes
        exitNodesInGroup.forEach(exitNode => {
          const nData = exitNode.data as { exitNodeData?: ExitNodeData };
          if (nData.exitNodeData?.reEntryConfig?.maxReEntries !== maxReEntries) {
            console.log(`Updating exit node ${exitNode.id} maxReEntries to ${maxReEntries} from retry node ${node.id}`);
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
        });
        
        // Update other retry nodes
        retryNodesInGroup.forEach(retryNode => {
          const nData = retryNode.data as { retryConfig?: { maxReEntries?: number } };
          if (nData.retryConfig?.maxReEntries !== maxReEntries) {
            console.log(`Updating retry node ${retryNode.id} maxReEntries to ${maxReEntries} from retry node ${node.id}`);
            updateNodeData(retryNode.id, {
              ...retryNode.data,
              retryConfig: {
                ...nData.retryConfig,
                maxReEntries
              }
            });
          }
        });
      }
    }
  }, [node?.type, node?.data, node?.id, nodes, updateNodeData]);

  // Helper utility to get the appropriate max re-entries for a group
  const getLatestGroupMaxReEntries = (defaultValue = 1): number => {
    // If no node provided, return the default
    if (!node) return defaultValue;

    // Get the current group number from the node
    const nodeData = node.data as { 
      exitNodeData?: ExitNodeData,
      retryConfig?: { groupNumber?: number }
    };
    
    let currentGroup: number | undefined;
    
    if (node.type === 'exitNode') {
      currentGroup = nodeData?.exitNodeData?.reEntryConfig?.groupNumber;
    } else if (node.type === 'retryNode') {
      currentGroup = nodeData?.retryConfig?.groupNumber;
    }
    
    if (currentGroup === undefined) return defaultValue;

    // Find other nodes in the same group (both exit nodes and retry nodes)
    const groupNodes = nodes.filter(n => {
      if (n.id === node?.id) return false;
      
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
    
    if (groupNodes.length === 0) return defaultValue;
    
    // Find the max re-entries value used in the group
    const groupMaxEntries = Math.max(...groupNodes.map(n => {
      if (n.type === 'exitNode') {
        const nData = n.data as { exitNodeData?: ExitNodeData };
        return nData.exitNodeData?.reEntryConfig?.maxReEntries || defaultValue;
      } else if (n.type === 'retryNode') {
        const nData = n.data as { retryConfig?: { maxReEntries?: number } };
        return nData.retryConfig?.maxReEntries || defaultValue;
      }
      return defaultValue;
    }));
    
    return groupMaxEntries;
  };
  
  return {
    getLatestGroupMaxReEntries
  };
};
