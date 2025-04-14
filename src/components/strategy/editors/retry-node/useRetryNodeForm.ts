
import { useState, useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { useRetryNodeEventHandlers } from './hooks/useRetryNodeEventHandlers';
import { useRetryNodeGroupSync } from './hooks/useRetryNodeGroupSync';
import { getNextAvailableGroupNumber } from './utils/retryGroupSync';

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
  
  // Initialize new retry nodes with the next available group number
  useEffect(() => {
    if (node.data?._isInitialized) return;
    
    const nextGroupNumber = getNextAvailableGroupNumber(nodes);
    
    if (nextGroupNumber !== groupNumber) {
      updateNodeData(node.id, {
        ...nodeData,
        retryConfig: {
          ...(nodeData.retryConfig || {}),
          groupNumber: nextGroupNumber
        },
        _isInitialized: true,
        _lastUpdated: Date.now()
      });
    } else {
      // Just mark as initialized
      updateNodeData(node.id, {
        ...nodeData,
        _isInitialized: true
      });
    }
  }, [node.id, nodeData, updateNodeData, nodes, groupNumber]);
  
  // Get event handlers
  const { 
    handleLabelChange,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  } = useRetryNodeEventHandlers({
    node,
    updateNodeData,
    nodeData,
    updatingRef
  });
  
  // Group synchronization
  const { syncGroupMaxReEntries } = useRetryNodeGroupSync({
    node,
    nodes,
    nodeData,
    updateNodeData,
    updatingRef
  });
  
  // Enhanced handler for max re-entries that syncs with the group
  const handleMaxReEntriesChangeWithSync = (value: number) => {
    const newMaxReEntries = value || 1;
    setMaxReEntries(newMaxReEntries);
    
    // First update this node
    handleMaxReEntriesChange(newMaxReEntries);
    
    // Then sync with other nodes in the group
    syncGroupMaxReEntries(newMaxReEntries);
  };
  
  return {
    label,
    groupNumber,
    maxReEntries,
    handleLabelChange,
    handleGroupNumberChange,
    handleMaxReEntriesChange: handleMaxReEntriesChangeWithSync
  };
};
