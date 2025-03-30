
import { useCallback, useEffect } from 'react';
import { NodeData } from '../types';

interface UseActionTypeHandlerProps {
  nodeId: string;
  nodeData: NodeData;
  updateNodeData: (id: string, data: any) => void;
  createDefaultPosition: () => any;
}

export const useActionTypeHandler = ({
  nodeId,
  nodeData,
  updateNodeData,
  createDefaultPosition
}: UseActionTypeHandlerProps) => {
  // Handler for label changes
  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(nodeId, { label: e.target.value });
  }, [nodeId, updateNodeData]);

  // Handler for action type changes
  const handleActionTypeChange = useCallback((value: string) => {
    updateNodeData(nodeId, { 
      actionType: value,
      // Reset positions if changing to alert
      ...(value === 'alert' && { positions: [] })
    });
  }, [nodeId, updateNodeData]);

  // Force update when action type changes
  useEffect(() => {
    if (nodeData?.actionType === 'alert' && nodeData?.positions?.length > 0) {
      // Reset positions when switching to alert
      updateNodeData(nodeId, { positions: [] });
    } else if ((nodeData?.actionType === 'entry' || nodeData?.actionType === 'exit') && 
              (!nodeData?.positions || nodeData.positions.length === 0)) {
      // Ensure at least one position for entry/exit nodes
      updateNodeData(nodeId, { positions: [createDefaultPosition()] });
    }
  }, [nodeData?.actionType, nodeData?.positions, nodeId, updateNodeData, createDefaultPosition]);

  return {
    handleLabelChange,
    handleActionTypeChange
  };
};
