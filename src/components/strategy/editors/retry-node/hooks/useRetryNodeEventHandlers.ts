
import { useCallback } from 'react';
import { Node } from '@xyflow/react';

interface RetryNodeData {
  label?: string;
  actionType?: string;
  retryConfig?: {
    groupNumber: number;
    maxReEntries: number;
  };
  [key: string]: any;
}

interface UseRetryNodeEventHandlersProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  nodeData: RetryNodeData;
  updatingRef: React.MutableRefObject<boolean>;
}

export const useRetryNodeEventHandlers = ({
  node,
  updateNodeData,
  nodeData,
  updatingRef
}: UseRetryNodeEventHandlersProps) => {
  // Handler for label change
  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    
    updateNodeData(node.id, {
      ...nodeData,
      label: newLabel,
      _lastUpdated: Date.now()
    });
  }, [node.id, nodeData, updateNodeData]);
  
  // Handler for group number change
  const handleGroupNumberChange = useCallback((value: number) => {
    const newGroupNumber = value || 1;
    
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
    } finally {
      // Reset the update flag after a short delay
      setTimeout(() => {
        updatingRef.current = false;
      }, 150);
    }
  }, [node.id, nodeData, updateNodeData, updatingRef]);
  
  return {
    handleLabelChange,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
