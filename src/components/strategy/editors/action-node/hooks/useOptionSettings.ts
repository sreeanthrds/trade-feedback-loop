
import { useCallback } from 'react';
import { NodeData } from '../types';

interface UseOptionSettingsProps {
  nodeId: string;
  updateNodeData: (id: string, data: any) => void;
  nodeData: NodeData;
}

export const useOptionSettings = ({
  nodeId,
  updateNodeData,
  nodeData
}: UseOptionSettingsProps) => {
  // Create option details object if it doesn't exist
  const ensureOptionDetails = useCallback(() => {
    if (!nodeData.optionDetails) {
      // Initialize with defaults
      updateNodeData(nodeId, { 
        optionDetails: {
          expiry: 'W0',
          strikeType: 'ATM',
          optionType: 'CE'
        }
      });
    }
  }, [nodeId, nodeData, updateNodeData]);
  
  const handleExpiryChange = useCallback((value: string) => {
    ensureOptionDetails();
    updateNodeData(nodeId, { 
      optionDetails: {
        ...nodeData.optionDetails,
        expiry: value
      }
    });
  }, [nodeId, nodeData.optionDetails, updateNodeData, ensureOptionDetails]);
  
  const handleStrikeTypeChange = useCallback((value: string) => {
    ensureOptionDetails();
    updateNodeData(nodeId, { 
      optionDetails: {
        ...nodeData.optionDetails,
        strikeType: value
      }
    });
  }, [nodeId, nodeData.optionDetails, updateNodeData, ensureOptionDetails]);
  
  const handleStrikeValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    ensureOptionDetails();
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updateNodeData(nodeId, { 
        optionDetails: {
          ...nodeData.optionDetails,
          strikeValue: value
        }
      });
    }
  }, [nodeId, nodeData.optionDetails, updateNodeData, ensureOptionDetails]);
  
  const handleOptionTypeChange = useCallback((value: string) => {
    ensureOptionDetails();
    updateNodeData(nodeId, { 
      optionDetails: {
        ...nodeData.optionDetails,
        optionType: value
      }
    });
  }, [nodeId, nodeData.optionDetails, updateNodeData, ensureOptionDetails]);
  
  return {
    handleExpiryChange,
    handleStrikeTypeChange,
    handleStrikeValueChange,
    handleOptionTypeChange
  };
};
