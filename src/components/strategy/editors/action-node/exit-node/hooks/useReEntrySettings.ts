
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../types';
import { useReEntryStateManagement } from './reEntry/useReEntryStateManagement';
import { useReEntryGroupManagement } from './reEntry/useReEntryGroupManagement';

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
  // Extract re-entry config from node data
  const exitNodeData = nodeData?.exitNodeData as ExitNodeData || defaultExitNodeData;
  const reEntryConfig = exitNodeData.reEntryConfig || { enabled: false, groupNumber: 1, maxReEntries: 1 };
  const reEntryEnabled = reEntryConfig.enabled || false;
  
  // Use state management hook
  const { updatingRef } = useReEntryStateManagement();
  
  // Use group management hook
  useReEntryGroupManagement({
    node,
    reEntryEnabled,
    reEntryConfig,
    nodeData,
    exitNodeData,
    updateNodeData,
    updatingRef
  });
  
  // Handler for toggling re-entry
  const handleReEntryToggle = useCallback((enabled: boolean) => {
    if (updatingRef.current) return;
    updatingRef.current = true;
    
    try {
      const currentExitNodeData = (node.data?.exitNodeData as ExitNodeData) || defaultExitNodeData;
      const currentConfig = currentExitNodeData.reEntryConfig || { 
        enabled: false, 
        groupNumber: 1, 
        maxReEntries: 1 
      };
      
      // Update re-entry config
      const updatedConfig = {
        ...currentConfig,
        enabled
      };
      
      // Update node data
      updateNodeData(node.id, {
        ...node.data,
        exitNodeData: {
          ...currentExitNodeData,
          reEntryConfig: updatedConfig
        }
      });
    } finally {
      setTimeout(() => {
        updatingRef.current = false;
      }, 150);
    }
  }, [node, updateNodeData, defaultExitNodeData, updatingRef]);
  
  return {
    reEntryEnabled,
    handleReEntryToggle
  };
};
