
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';

interface UseRetryNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useRetryNodeForm = ({ node, updateNodeData }: UseRetryNodeFormProps) => {
  const [label, setLabel] = useState(node.data?.label || 'Retry');
  const [groupNumber, setGroupNumber] = useState(node.data?.retryConfig?.groupNumber || 1);
  const [maxReEntries, setMaxReEntries] = useState(node.data?.retryConfig?.maxReEntries || 1);

  // Sync with node data when it changes
  useEffect(() => {
    if (node.data) {
      setLabel(node.data.label || 'Retry');
      setGroupNumber(node.data.retryConfig?.groupNumber || 1);
      setMaxReEntries(node.data.retryConfig?.maxReEntries || 1);
    }
  }, [node.data]);

  // Handler for label change
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    updateNodeData(node.id, {
      ...node.data,
      label: newLabel,
      _lastUpdated: Date.now()
    });
  };

  // Handler for group number change
  const handleGroupNumberChange = (value: number) => {
    setGroupNumber(value);
    updateNodeData(node.id, {
      ...node.data,
      retryConfig: {
        ...node.data.retryConfig,
        groupNumber: value
      },
      _lastUpdated: Date.now()
    });
  };

  // Handler for maximum re-entries change
  const handleMaxReEntriesChange = (value: number) => {
    setMaxReEntries(value);
    updateNodeData(node.id, {
      ...node.data,
      retryConfig: {
        ...node.data.retryConfig,
        maxReEntries: value
      },
      _lastUpdated: Date.now()
    });
  };

  return {
    label,
    groupNumber,
    maxReEntries,
    handleLabelChange,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
