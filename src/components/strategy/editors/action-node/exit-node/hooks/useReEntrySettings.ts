
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ReEntryConfig, ExitNodeData } from '../types';
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
  // Get or initialize re-entry config
  const exitNodeData = nodeData.exitNodeData as ExitNodeData | undefined;
  const initialReEntryConfig: ReEntryConfig = exitNodeData?.reEntryConfig || {
    enabled: false,
    groupNumber: 0,
    maxReEntries: 0
  };
  
  // State for re-entry settings
  const [reEntryEnabled, setReEntryEnabled] = useState<boolean>(
    initialReEntryConfig.enabled || false
  );
  
  const [groupNumber, setGroupNumber] = useState<number>(
    initialReEntryConfig.groupNumber || 0
  );
  
  const [maxReEntries, setMaxReEntries] = useState<number>(
    initialReEntryConfig.maxReEntries || 0
  );
  
  // Use group sync hook
  const { getLatestGroupMaxReEntries } = useReEntryGroupSync({
    node,
    updateNodeData,
    groupNumber,
    reEntryEnabled
  });
  
  // Use event handlers hook
  const {
    handleReEntryToggle,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  } = useReEntryEventHandlers({
    node,
    updateNodeData,
    nodeData,
    defaultExitNodeData,
    reEntryEnabled,
    setReEntryEnabled,
    groupNumber,
    setGroupNumber,
    maxReEntries,
    setMaxReEntries
  });
  
  // Effect to check and sync with other nodes in the same group
  useEffect(() => {
    // Get the latest max re-entries from the group (if any)
    const latestMaxReEntries = getLatestGroupMaxReEntries(maxReEntries);
    
    // Only update state if the value has changed
    if (latestMaxReEntries !== maxReEntries) {
      setMaxReEntries(latestMaxReEntries);
    }
  }, [nodeData, groupNumber, reEntryEnabled]);
  
  return {
    reEntryEnabled,
    groupNumber,
    maxReEntries,
    handleReEntryToggle,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
