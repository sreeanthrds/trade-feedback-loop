
import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData, ReEntryConfig } from '../types';

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

  // Function to find connected retry node and edges
  const findRetryNodeAndEdges = useCallback(() => {
    // This function needs access to the entire flow state
    // It would typically be passed down from a parent component
    // For now, we'll assume it's handled in the node update handler
    return { 
      retryNodeId: null, 
      edgesToRemove: [] 
    };
  }, []);

  // Handle toggle of re-entry functionality
  const handleReEntryToggle = useCallback((checked: boolean) => {
    setReEntryEnabled(checked);
    
    // Update the node data
    const updatedExitNodeData = {
      ...exitNodeData,
      reEntryConfig: {
        enabled: checked,
        groupNumber: reEntryConfig?.groupNumber || 1, // Preserve existing or use default
        maxReEntries: reEntryConfig?.maxReEntries || 1  // Preserve existing or use default
      }
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData,
      _lastToggleReEntry: checked, // Special flag for node handler to detect toggle state
      _lastUpdated: Date.now()
    });
  }, [node.id, nodeData, exitNodeData, updateNodeData, reEntryConfig]);
  
  return {
    reEntryEnabled,
    handleReEntryToggle
  };
};
