
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

    // Use timestamp to force update, along with additional fields to ensure change detection
    const updateTime = Date.now();
    updateNodeData(node.id, { 
      actionType, 
      label,
      _lastUpdated: updateTime,
      _forceUpdate: Math.random().toString(36).substring(7) // Add random string to ensure update
    });
  }, [node.id, updateNodeData]);

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Use timestamp to force update, along with additional fields to ensure change detection
    const updateTime = Date.now();
    updateNodeData(node.id, { 
      label: e.target.value,
      _lastUpdated: updateTime,
      _forceUpdate: Math.random().toString(36).substring(7) // Add random string to ensure update
    });
  }, [node.id, updateNodeData]);

  return {
    handleActionTypeChange,
    handleLabelChange
  };
};
