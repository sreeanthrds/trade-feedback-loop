
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';

interface UseRetryNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface RetryConfig {
  groupNumber: number;
  maxReEntries: number;
}

export const useRetryNodeForm = ({ node, updateNodeData }: UseRetryNodeFormProps) => {
  const [label, setLabel] = useState<string>((node.data?.label as string) || 'Retry');
  
  // Safely access retryConfig or fallback to direct properties
  const initialRetryConfig: RetryConfig = (() => {
    if (node.data?.retryConfig && typeof node.data.retryConfig === 'object') {
      return {
        groupNumber: (node.data.retryConfig as any).groupNumber || 1,
        maxReEntries: (node.data.retryConfig as any).maxReEntries || 1
      };
    }
    return {
      groupNumber: (node.data?.groupNumber as number) || 1,
      maxReEntries: (node.data?.maxReEntries as number) || 1
    };
  })();
  
  const [groupNumber, setGroupNumber] = useState<number>(initialRetryConfig.groupNumber);
  const [maxReEntries, setMaxReEntries] = useState<number>(initialRetryConfig.maxReEntries);

  // Sync with node data when it changes
  useEffect(() => {
    if (node.data) {
      setLabel((node.data.label as string) || 'Retry');
      
      // Handle both structured and flat formats
      if (node.data.retryConfig && typeof node.data.retryConfig === 'object') {
        setGroupNumber((node.data.retryConfig as any).groupNumber || 1);
        setMaxReEntries((node.data.retryConfig as any).maxReEntries || 1);
      } else {
        setGroupNumber((node.data.groupNumber as number) || 1);
        setMaxReEntries((node.data.maxReEntries as number) || 1);
      }
    }
  }, [node.data]);

  // Handler for label change
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    updateNodeData(node.id, {
      ...node.data as object,
      label: newLabel,
      _lastUpdated: Date.now()
    });
  };

  // Handler for group number change
  const handleGroupNumberChange = (value: number) => {
    const safeValue = value || 1;
    setGroupNumber(safeValue);
    updateNodeData(node.id, {
      ...node.data as object,
      retryConfig: {
        groupNumber: safeValue,
        maxReEntries: maxReEntries
      },
      _lastUpdated: Date.now()
    });
  };

  // Handler for maximum re-entries change
  const handleMaxReEntriesChange = (value: number) => {
    const safeValue = value || 1;
    setMaxReEntries(safeValue);
    updateNodeData(node.id, {
      ...node.data as object,
      retryConfig: {
        groupNumber: groupNumber,
        maxReEntries: safeValue
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
