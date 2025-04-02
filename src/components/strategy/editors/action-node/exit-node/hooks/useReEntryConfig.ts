
import { Node } from '@xyflow/react';
import { ReEntryConfig, ExitNodeData } from '../types';

interface UseReEntryConfigProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  nodeData: any;
  defaultExitNodeData?: ExitNodeData;
}

export const useReEntryConfig = ({
  node,
  updateNodeData,
  nodeData,
  defaultExitNodeData
}: UseReEntryConfigProps) => {
  // Update the re-entry config in the node data
  const updateReEntryConfig = (config: ReEntryConfig, fallbackDefaultData?: ExitNodeData) => {
    // Get the latest exit node data or use default
    const defaultData = fallbackDefaultData || defaultExitNodeData;
    const currentExitNodeData = nodeData.exitNodeData || defaultData;
    
    // Create updated exit node data with new re-entry config
    const updatedExitNodeData = {
      ...currentExitNodeData,
      reEntryConfig: config
    };
    
    // Update the node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData,
      _lastUpdated: Date.now()
    });
  };
  
  // Validate group number (must be at least 1 when re-entry is enabled)
  const validateGroupNumber = (value: number | undefined, enabled: boolean): boolean => {
    if (enabled && (!value || value < 1)) {
      return false;
    }
    return true;
  };
  
  // Validate max re-entries (must be a non-negative number)
  const validateMaxReEntries = (value: number | undefined): boolean => {
    return value !== undefined && value >= 0;
  };
  
  return {
    updateReEntryConfig,
    validateGroupNumber,
    validateMaxReEntries
  };
};
