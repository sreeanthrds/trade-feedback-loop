
import { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { findNodesInSameGroup, getExitNodeMaxReEntries, getRetryNodeMaxReEntries } from '../utils/retryGroupSync';

interface RetryNodeData {
  label?: string;
  actionType?: string;
  retryConfig?: {
    groupNumber: number;
    maxReEntries: number;
  };
  [key: string]: any;
}

interface UseRetryNodeGroupSyncProps {
  node: Node;
  nodes: Node[];
  nodeData: RetryNodeData;
  updateNodeData: (id: string, data: any) => void;
  updatingRef: React.MutableRefObject<boolean>;
}

export const useRetryNodeGroupSync = ({
  node,
  nodes,
  nodeData,
  updateNodeData,
  updatingRef
}: UseRetryNodeGroupSyncProps) => {
  // Sync with other nodes when group number changes
  useEffect(() => {
    if (updatingRef.current || !nodeData.retryConfig) return;
    
    const currentGroup = nodeData.retryConfig.groupNumber;
    
    // Find existing nodes in the same group
    const existingGroupNodes = findNodesInSameGroup(nodes, currentGroup, node.id);
    
    // If joining an existing group, adopt its maxReEntries
    if (existingGroupNodes.length > 0) {
      const firstNode = existingGroupNodes[0];
      let existingMaxReEntries: number | undefined;
      
      if (firstNode.type === 'exitNode') {
        existingMaxReEntries = getExitNodeMaxReEntries(firstNode);
      } else if (firstNode.type === 'retryNode') {
        existingMaxReEntries = getRetryNodeMaxReEntries(firstNode);
      }
      
      if (existingMaxReEntries !== undefined && existingMaxReEntries !== nodeData.retryConfig.maxReEntries) {
        console.log(`Node ${node.id} adopting maxReEntries ${existingMaxReEntries} from group ${currentGroup}`);
        
        updatingRef.current = true;
        updateNodeData(node.id, {
          ...nodeData,
          retryConfig: {
            ...nodeData.retryConfig,
            maxReEntries: existingMaxReEntries
          },
          _lastUpdated: Date.now()
        });
        
        setTimeout(() => {
          updatingRef.current = false;
        }, 100);
      }
    }
  }, [node.id, nodeData, nodes, updateNodeData, updatingRef]);

  // Sync maxReEntries across all nodes in the same group
  const syncGroupMaxReEntries = (newMaxReEntries: number) => {
    if (updatingRef.current || !nodeData.retryConfig) return;
    updatingRef.current = true;
    
    try {
      const currentGroup = nodeData.retryConfig.groupNumber;
      
      // Sync with other nodes in the same group (both exit nodes and retry nodes)
      nodes.forEach(n => {
        if (n.id === node.id) return; // Skip current node
        
        if (n.type === 'exitNode') {
          const nData = n.data as { exitNodeData?: any };
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
        } else if (n.type === 'retryNode') {
          const nData = n.data as { retryConfig?: any };
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
  };
  
  return {
    syncGroupMaxReEntries
  };
};
