
import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface UseReEntryToggleProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  nodeData: any;
  defaultExitNodeData: ExitNodeData;
}

export const useReEntryToggle = ({
  node,
  updateNodeData,
  nodeData,
  defaultExitNodeData
}: UseReEntryToggleProps) => {
  const [reEntryEnabled, setReEntryEnabled] = useState(
    nodeData?.exitNodeData?.reEntryConfig?.enabled || false
  );

  // Sync with node data
  useEffect(() => {
    if (node?.data) {
      const nodeDataObj = node.data as { exitNodeData?: ExitNodeData };
      const updatedConfig = nodeDataObj.exitNodeData?.reEntryConfig;
      
      if (updatedConfig) {
        setReEntryEnabled(updatedConfig.enabled || false);
      }
    }
  }, [node?.data]);

  // Handle toggle of re-entry feature
  const handleReEntryToggle = useCallback((enabled: boolean) => {
    setReEntryEnabled(enabled);
    
    // Get current exit node data with type safety
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;

    // Make sure reEntryConfig exists
    const currentReEntryConfig = currentExitNodeData.reEntryConfig || {
      enabled: false,
      groupNumber: 1,
      maxReEntries: 1
    };
    
    // Update node data with new re-entry config
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: {
        ...currentExitNodeData,
        reEntryConfig: {
          ...currentReEntryConfig,
          enabled: enabled
        }
      },
      _lastUpdated: Date.now()
    });
    
    // If enabled, you would typically create or connect to a retry node
    // This would be handled in the flow state management layer
  }, [node.id, nodeData, updateNodeData, defaultExitNodeData]);

  return {
    reEntryEnabled,
    handleReEntryToggle
  };
};
