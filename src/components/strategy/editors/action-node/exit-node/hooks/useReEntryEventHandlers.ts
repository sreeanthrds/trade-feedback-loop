
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../types';
import { useReEntryGroupSync } from './useReEntryGroupSync';

interface UseReEntryEventHandlersProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  nodeData: any;
  defaultExitNodeData: ExitNodeData;
  updateReEntryConfig?: (config: any, defaultExitNodeData: ExitNodeData) => void;
}

export const useReEntryEventHandlers = ({
  node,
  updateNodeData,
  nodeData,
  defaultExitNodeData,
  updateReEntryConfig,
}: UseReEntryEventHandlersProps) => {
  // Get group sync utilities with proper props
  const groupSync = useReEntryGroupSync({
    node,
    updateNodeData,
    defaultExitNodeData
  });
  
  // Handle toggle of re-entry feature
  const handleReEntryToggle = useCallback((enabled: boolean) => {
    // Get current exit node data with type safety
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;

    // Make sure reEntryConfig exists
    const currentReEntryConfig = currentExitNodeData.reEntryConfig || {
      enabled: false,
      groupNumber: 0,
      maxReEntries: 0
    };
    
    // If enabling re-entry, sync with existing group if possible
    let updatedConfig;
    if (enabled) {
      const maxReEntries = groupSync.getLatestGroupMaxReEntries(currentReEntryConfig.maxReEntries || 1);
      
      updatedConfig = {
        enabled: true,
        groupNumber: currentReEntryConfig.groupNumber || 1,
        maxReEntries: maxReEntries
      };
    } else {
      updatedConfig = {
        ...currentReEntryConfig,
        enabled: false
      };
    }
    
    // Update node data directly or via the provided updateReEntryConfig function
    if (updateReEntryConfig) {
      updateReEntryConfig(updatedConfig, defaultExitNodeData);
    } else {
      // Fallback direct update
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: {
          ...currentExitNodeData,
          reEntryConfig: updatedConfig
        }
      });
    }
  }, [node.id, nodeData, updateNodeData, defaultExitNodeData, groupSync, updateReEntryConfig]);

  // Handle group number change
  const handleGroupNumberChange = useCallback((groupNumber: number) => {
    // Get current exit node data with type safety
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;

    // Make sure reEntryConfig exists
    const currentReEntryConfig = currentExitNodeData.reEntryConfig || {
      enabled: false,
      groupNumber: 0,
      maxReEntries: 0
    };
    
    // Ensure groupNumber is a number
    const numericGroupNumber = typeof groupNumber === 'number' ? groupNumber : 
      parseInt(groupNumber as unknown as string) || 1;
    
    // Create the updated config
    const updatedConfig = {
      ...currentReEntryConfig,
      groupNumber: numericGroupNumber
    };
    
    // Update node data directly or via the provided updateReEntryConfig function
    if (updateReEntryConfig) {
      updateReEntryConfig(updatedConfig, defaultExitNodeData);
    } else {
      // Fallback direct update
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: {
          ...currentExitNodeData,
          reEntryConfig: updatedConfig
        }
      });
    }
  }, [node.id, nodeData, updateNodeData, defaultExitNodeData, updateReEntryConfig]);

  // Handle max re-entries change
  const handleMaxReEntriesChange = useCallback((maxReEntries: number) => {
    // Get current exit node data with type safety
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;

    // Make sure reEntryConfig exists
    const currentReEntryConfig = currentExitNodeData.reEntryConfig || {
      enabled: false,
      groupNumber: 0,
      maxReEntries: 0
    };
    
    // Ensure maxReEntries is a number
    const numericMaxReEntries = typeof maxReEntries === 'number' ? maxReEntries : 
      parseInt(maxReEntries as unknown as string) || 1;
    
    // Create the updated config
    const updatedConfig = {
      ...currentReEntryConfig,
      maxReEntries: numericMaxReEntries
    };
    
    // Update node data directly or via the provided updateReEntryConfig function
    if (updateReEntryConfig) {
      updateReEntryConfig(updatedConfig, defaultExitNodeData);
    } else {
      // Fallback direct update
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: {
          ...currentExitNodeData,
          reEntryConfig: updatedConfig
        }
      });
    }
  }, [node.id, nodeData, updateNodeData, defaultExitNodeData, updateReEntryConfig]);

  return {
    handleReEntryToggle,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
