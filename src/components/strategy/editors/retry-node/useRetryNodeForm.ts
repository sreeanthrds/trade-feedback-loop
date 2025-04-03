
import { useCallback, useState, useEffect } from 'react';
import { Node } from '@xyflow/react';

interface UseRetryNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useRetryNodeForm = ({ node, updateNodeData }: UseRetryNodeFormProps) => {
  // Get the node data
  const nodeData = node.data || {};
  const retryConfig = nodeData.retryConfig || { groupNumber: 1, maxReEntries: 1 };
  
  // State
  const [label, setLabel] = useState<string>(nodeData.label || 'Retry');
  const [groupNumber, setGroupNumber] = useState<number>(retryConfig.groupNumber || 1);
  const [maxReEntries, setMaxReEntries] = useState<number>(retryConfig.maxReEntries || 1);
  
  // Update state when node data changes
  useEffect(() => {
    setLabel(nodeData.label || 'Retry');
    setGroupNumber(retryConfig.groupNumber || 1);
    setMaxReEntries(retryConfig.maxReEntries || 1);
  }, [nodeData, retryConfig]);
  
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
    const newMaxReEntries = value || 1;
    setMaxReEntries(newMaxReEntries);
    
    updateNodeData(node.id, {
      ...nodeData,
      retryConfig: {
        ...(nodeData.retryConfig || {}),
        maxReEntries: newMaxReEntries
      },
      _lastUpdated: Date.now()
    });
  }, [node.id, nodeData, updateNodeData]);
  
  return {
    label,
    groupNumber,
    maxReEntries,
    handleLabelChange,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
