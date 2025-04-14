
import { useCallback, useState, useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { ExitNodeData } from '../action-node/exit-node/types';

interface RetryConfig {
  groupNumber: number;
  maxReEntries: number;
}

interface RetryNodeData {
  label?: string;
  actionType?: string;
  retryConfig?: RetryConfig;
  [key: string]: any;
}

interface UseRetryNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useRetryNodeForm = ({ node, updateNodeData }: UseRetryNodeFormProps) => {
  // Get the node data with proper typing
  const nodeData = node.data as RetryNodeData || {};
  const retryConfig = nodeData.retryConfig || { groupNumber: 1, maxReEntries: 1 };
  
  // Get all nodes to find nodes in the same group
  const nodes = useStrategyStore(state => state.nodes);
  
  // Use refs to prevent infinite update loops
  const updatingRef = useRef<boolean>(false);
  
  // State
  const [label, setLabel] = useState<string>(nodeData.label || 'Retry');
  const [groupNumber, setGroupNumber] = useState<number>(retryConfig.groupNumber || 1);
  const [maxReEntries, setMaxReEntries] = useState<number>(retryConfig.maxReEntries || 1);
  
  // Update state when node data changes
  useEffect(() => {
    const data = node.data as RetryNodeData;
    setLabel(data?.label || 'Retry');
    
    const config = data?.retryConfig || { groupNumber: 1, maxReEntries: 1 };
    setGroupNumber(config.groupNumber || 1);
    setMaxReEntries(config.maxReEntries || 1);
  }, [node.data]);
  
  // Sync with other nodes in the same group when group number changes
  useEffect(() => {
    if (updatingRef.current) return;
    
    // Find all nodes with the same group number
    const exitNodesInGroup = nodes.filter(n => {
      if (n.type !== 'exitNode') return false;
      
      const nData = n.data as { exitNodeData?: ExitNodeData };
      return nData.exitNodeData?.reEntryConfig?.enabled && 
             nData.exitNodeData?.reEntryConfig?.groupNumber === groupNumber;
    });
    
    const retryNodesInGroup = nodes.filter(n => {
      if (n.id === node.id) return false; // Skip current node
      if (n.type !== 'retryNode') return false;
      
      const nData = n.data as RetryNodeData;
      return nData.retryConfig?.groupNumber === groupNumber;
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
      
      // If no value from exit nodes, check other retry nodes
      if (groupMaxReEntries === undefined && retryNodesInGroup.length > 0) {
        for (const retryNode of retryNodesInGroup) {
          const nData = retryNode.data as RetryNodeData;
          if (nData.retryConfig?.maxReEntries !== undefined) {
            groupMaxReEntries = nData.retryConfig.maxReEntries;
            break;
          }
        }
      }
      
      // If we found a group value and it's different from our current value, update our state
      if (groupMaxReEntries !== undefined && groupMaxReEntries !== maxReEntries) {
        console.log(`Retry node ${node.id} adopting maxReEntries ${groupMaxReEntries} from group ${groupNumber}`);
        setMaxReEntries(groupMaxReEntries);
        
        // Also update the node data to match
        updatingRef.current = true;
        updateNodeData(node.id, {
          ...nodeData,
          retryConfig: {
            ...(nodeData.retryConfig || {}),
            maxReEntries: groupMaxReEntries
          },
          _lastUpdated: Date.now()
        });
        
        setTimeout(() => {
          updatingRef.current = false;
        }, 100);
      }
    }
  }, [node.id, nodeData, groupNumber, maxReEntries, nodes, updateNodeData]);
  
  // Handler for label change
  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    
    updateNodeData(node.id, {
      ...nodeData,
      label: newLabel,
      _lastUpdated: Date.now()
    });
  }, [node.id, nodeData, updateNodeData]);
  
  // Handler for group number change
  const handleGroupNumberChange = useCallback((value: number) => {
    const newGroupNumber = value || 1;
    setGroupNumber(newGroupNumber);
    
    updateNodeData(node.id, {
      ...nodeData,
      retryConfig: {
        ...(nodeData.retryConfig || {}),
        groupNumber: newGroupNumber
      },
      _lastUpdated: Date.now()
    });
  }, [node.id, nodeData, updateNodeData]);
  
  // Handler for max re-entries change
  const handleMaxReEntriesChange = useCallback((value: number) => {
    if (updatingRef.current) return;
    updatingRef.current = true;
    
    const newMaxReEntries = value || 1;
    setMaxReEntries(newMaxReEntries);
    
    try {
      // Update this node
      updateNodeData(node.id, {
        ...nodeData,
        retryConfig: {
          ...(nodeData.retryConfig || {}),
          maxReEntries: newMaxReEntries
        },
        _lastUpdated: Date.now()
      });
      
      // Sync with other nodes in the same group (both exit nodes and retry nodes)
      const currentGroup = nodeData.retryConfig?.groupNumber || 1;
      
      // For exit nodes
      nodes.forEach(n => {
        if (n.type === 'exitNode') {
          const nData = n.data as { exitNodeData?: ExitNodeData };
          if (nData.exitNodeData?.reEntryConfig?.enabled && 
              nData.exitNodeData?.reEntryConfig?.groupNumber === currentGroup &&
              nData.exitNodeData?.reEntryConfig?.maxReEntries !== newMaxReEntries) {
            console.log(`Updating exit node ${n.id} maxReEntries to ${newMaxReEntries} from retry node ${node.id}`);
            updateNodeData(n.id, {
              ...n.data,
              exitNodeData: {
                ...nData.exitNodeData,
                reEntryConfig: {
                  ...nData.exitNodeData.reEntryConfig,
                  maxReEntries: newMaxReEntries
                }
              },
              _lastUpdated: Date.now()
            });
          }
        } else if (n.type === 'retryNode' && n.id !== node.id) {
          const nData = n.data as RetryNodeData;
          if (nData.retryConfig?.groupNumber === currentGroup &&
              nData.retryConfig?.maxReEntries !== newMaxReEntries) {
            console.log(`Updating retry node ${n.id} maxReEntries to ${newMaxReEntries} from retry node ${node.id}`);
            updateNodeData(n.id, {
              ...n.data,
              retryConfig: {
                ...nData.retryConfig,
                maxReEntries: newMaxReEntries
              },
              _lastUpdated: Date.now()
            });
          }
        }
      });
    } finally {
      // Reset the update flag after a short delay
      setTimeout(() => {
        updatingRef.current = false;
      }, 150);
    }
  }, [node.id, nodeData, updateNodeData, nodes]);
  
  return {
    label,
    groupNumber,
    maxReEntries,
    handleLabelChange,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
