
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
    }

    updateNodeData(node.id, { 
      actionType, 
      label
    });
  }, [node.id, updateNodeData]);

  return {
    handleActionTypeChange
  };
};
