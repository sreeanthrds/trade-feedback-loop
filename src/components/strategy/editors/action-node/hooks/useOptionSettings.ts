
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
  const handleExpiryChange = useCallback((value: string) => {
    updateNodeData(nodeId, { 
      optionDetails: {
        ...nodeData?.optionDetails,
        expiry: value
      }
    });
  }, [nodeId, nodeData?.optionDetails, updateNodeData]);
  
  const handleStrikeTypeChange = useCallback((value: string) => {
    updateNodeData(nodeId, { 
      optionDetails: {
        ...nodeData?.optionDetails,
        strikeType: value,
        // Reset strike value if not premium
        ...(value !== 'premium' && { strikeValue: undefined })
      }
    });
  }, [nodeId, nodeData?.optionDetails, updateNodeData]);
  
  const handleStrikeValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updateNodeData(nodeId, { 
        optionDetails: {
          ...nodeData?.optionDetails,
          strikeValue: value
        }
      });
    }
  }, [nodeId, nodeData?.optionDetails, updateNodeData]);
  
  const handleOptionTypeChange = useCallback((value: string) => {
    updateNodeData(nodeId, { 
      optionDetails: {
        ...nodeData?.optionDetails,
        optionType: value
      }
    });
  }, [nodeId, nodeData?.optionDetails, updateNodeData]);
  
  return {
    handleExpiryChange,
    handleStrikeTypeChange,
    handleStrikeValueChange,
    handleOptionTypeChange
  };
};
