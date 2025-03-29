
import { useCallback } from 'react';
import { Node } from '@xyflow/react';

export const useActionTypeHandler = (
  node: Node,
  updateNodeData: (id: string, data: any) => void
) => {
  const handleActionTypeChange = useCallback((actionType: string) => {
    // Update node label based on action type
    let label = 'Action';
    switch (actionType) {
      case 'entry':
        label = 'Entry Order';
        break;
      case 'exit':
        label = 'Exit Order';
        break;
      case 'alert':
        label = 'Alert';
        break;
      default:
        label = 'Action';
    }

    updateNodeData(node.id, { 
      actionType, 
      label,
      _lastUpdated: Date.now() // Add timestamp to force update
    });
  }, [node.id, updateNodeData]);

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { 
      label: e.target.value,
      _lastUpdated: Date.now() // Add timestamp to force update
    });
  }, [node.id, updateNodeData]);

  return {
    handleActionTypeChange,
    handleLabelChange
  };
};
