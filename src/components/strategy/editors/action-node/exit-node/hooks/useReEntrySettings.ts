
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../types';
import { useReEntryConfig } from './useReEntryConfig';
import { useReEntryEventHandlers } from './useReEntryEventHandlers';
import { useReEntryGroupSync } from './useReEntryGroupSync';

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
  const exitNodeData = nodeData?.exitNodeData || defaultExitNodeData;
  const { reEntryConfig: initialConfig } = exitNodeData;
  
  // Default values
  const [reEntryEnabled, setReEntryEnabled] = useState(
    initialConfig?.enabled || false
  );
  
  const [groupNumber, setGroupNumber] = useState(
    initialConfig?.groupNumber || 1
  );
  
  const [maxReEntries, setMaxReEntries] = useState(
    initialConfig?.maxReEntries || 1
  );

  // Use specialized hooks
  useReEntryGroupSync({
    node,
    updateNodeData,
    defaultExitNodeData
  });
  
  // Config management hook
  const { updateReEntryConfig } = useReEntryConfig({
    node,
    updateNodeData,
    nodeData,
    defaultExitNodeData
  });
  
  // Event handlers
  const { 
    handleReEntryToggle: onReEntryToggle, 
    handleGroupNumberChange: onGroupNumberChange,
    handleMaxReEntriesChange: onMaxReEntriesChange
  } = useReEntryEventHandlers({
    node,
    updateNodeData,
    nodeData,
    defaultExitNodeData,
    updateReEntryConfig
  });
  
  // Sync local state with node data
  useEffect(() => {
    const updatedData = node.data?.exitNodeData?.reEntryConfig;
    if (updatedData) {
      setReEntryEnabled(updatedData.enabled || false);
      setGroupNumber(updatedData.groupNumber || 1);
      setMaxReEntries(updatedData.maxReEntries || 1);
    }
  }, [node.data]);
  
  // Create handler functions with proper state updates
  const handleReEntryToggle = (checked: boolean) => {
    setReEntryEnabled(checked);
    onReEntryToggle(checked);
  };
  
  const handleGroupNumberChange = (value: number) => {
    setGroupNumber(value);
    onGroupNumberChange(value);
  };
  
  const handleMaxReEntriesChange = (value: number) => {
    setMaxReEntries(value);
    onMaxReEntriesChange(value);
  };
  
  return {
    reEntryEnabled,
    groupNumber,
    maxReEntries,
    handleReEntryToggle,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
