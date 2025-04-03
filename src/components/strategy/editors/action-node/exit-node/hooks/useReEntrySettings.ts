
import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../types';

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
  const reEntryConfig = exitNodeData?.reEntryConfig;
  
  // Local state
  const [reEntryEnabled, setReEntryEnabled] = useState(
    reEntryConfig?.enabled || false
  );

  // Sync state with node data
  useEffect(() => {
    if (reEntryConfig) {
      setReEntryEnabled(reEntryConfig.enabled || false);
    }
  }, [reEntryConfig]);

  // Handle toggle of re-entry functionality
  const handleReEntryToggle = useCallback((checked: boolean) => {
    setReEntryEnabled(checked);
    
    // Update the node data
    const updatedExitNodeData = {
      ...exitNodeData,
      reEntryConfig: {
        enabled: checked,
        groupNumber: 1, // Default group number
        maxReEntries: 1  // Default max re-entries
      }
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData,
      _lastUpdated: Date.now()
    });
  }, [node.id, nodeData, exitNodeData, updateNodeData]);
  
  return {
    reEntryEnabled,
    handleReEntryToggle
  };
};
