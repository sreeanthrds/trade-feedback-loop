
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
      return true;
    }
    return false;
  }, [nodeId, nodeData, updateNodeData]);
  
  const handleExpiryChange = useCallback((value: string) => {
    const wasInitialized = ensureOptionDetails();
    
    updateNodeData(nodeId, { 
      optionDetails: {
        ...(!wasInitialized ? nodeData.optionDetails : {}),
        expiry: value
      }
    });
  }, [nodeId, nodeData.optionDetails, updateNodeData, ensureOptionDetails]);
  
  const handleStrikeTypeChange = useCallback((value: string) => {
    const wasInitialized = ensureOptionDetails();
    
    // For premium type, ensure we initialize with default strike value if not already set
    const updatedOptions = { 
      ...(!wasInitialized ? nodeData.optionDetails : {}),
      strikeType: value
    };
    
    // If changing to premium type and no strike value is set, set a default
    if (value === 'premium' && (!nodeData.optionDetails?.strikeValue)) {
      updatedOptions.strikeValue = 100;
    }
    
    updateNodeData(nodeId, { 
      optionDetails: updatedOptions
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
    const wasInitialized = ensureOptionDetails();
    
    updateNodeData(nodeId, { 
      optionDetails: {
        ...(!wasInitialized ? nodeData.optionDetails : {}),
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
