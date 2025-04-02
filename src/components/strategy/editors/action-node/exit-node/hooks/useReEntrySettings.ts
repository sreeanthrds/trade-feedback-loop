
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData, ReEntryConfig } from '../types';
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
  const reEntryConfig = exitNodeData?.reEntryConfig as ReEntryConfig | undefined;
  
  // Default values
  const [reEntryEnabled, setReEntryEnabled] = useState(
    reEntryConfig?.enabled || false
  );
  
  const [groupNumber, setGroupNumber] = useState(
    reEntryConfig?.groupNumber || 1
  );
  
  const [maxReEntries, setMaxReEntries] = useState(
    reEntryConfig?.maxReEntries || 1
  );

  // Use specialized hooks with explicit props
  useReEntryGroupSync({
    node,
    updateNodeData,
    defaultExitNodeData
  });
  
  // Config management hook
  const { updateReEntryConfig } = useReEntryConfig({
    node,
    updateNodeData,
    nodeData
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
    // Safely access the node data with proper type casting
    if (node?.data) {
      const nodeDataObj = node.data as { exitNodeData?: ExitNodeData };
      const updatedConfig = nodeDataObj.exitNodeData?.reEntryConfig;
      
      if (updatedConfig) {
        setReEntryEnabled(updatedConfig.enabled || false);
        setGroupNumber(updatedConfig.groupNumber || 1);
        setMaxReEntries(updatedConfig.maxReEntries || 1);
      }
    }
  }, [node?.data]);
  
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
