
import React, { useMemo, memo } from 'react';
import { NodeProps } from '@xyflow/react';
import ActionNodeTemplate from './templates/ActionNodeTemplate';
import { getNodeIcon } from '../utils/nodes/nodeIcons';
import { useStartNodeSymbol } from './action-node/useStartNodeSymbol';

const RetryNode: React.FC<NodeProps> = ({ id, data, selected, isConnectable, type, zIndex, dragging, draggable, selectable, deletable, positionAbsoluteX, positionAbsoluteY }) => {
  const startNodeSymbol = useStartNodeSymbol();
  
  // Create a safe version of nodeData with default values for required fields
  const nodeData = useMemo(() => {
    const rawData = data as Record<string, unknown>;
    
    // Get retry configuration with type handling
    const retryConfig = typeof rawData.retryConfig === 'object' && rawData.retryConfig 
      ? rawData.retryConfig as { groupNumber: number, maxReEntries: number }
      : { groupNumber: 1, maxReEntries: 1 };
    
    return {
      label: (rawData.label as string) || 'Re-entry', // Changed from 'Retry' to 'Re-entry'
      actionType: 'entry' as const,
      _actionTypeInternal: 'retry', // Added to distinguish type for ActionNodeTemplate
      positions: Array.isArray(rawData.positions) ? rawData.positions : [],
      icon: getNodeIcon('retry'),
      description: 'Re-enter the trade',
      // Retry specific properties with proper type handling
      retryConfig: {
        groupNumber: retryConfig.groupNumber || 1,
        maxReEntries: retryConfig.maxReEntries || 1
      }
    };
  }, [data]);

  return (
    <ActionNodeTemplate
      id={id}
      data={nodeData}
      selected={selected}
      isConnectable={isConnectable}
      type={type || 'retryNode'}
      zIndex={zIndex || 0}
      dragging={dragging || false}
      draggable={draggable !== undefined ? draggable : true}
      selectable={selectable !== undefined ? selectable : true}
      deletable={deletable !== undefined ? deletable : true}
      positionAbsoluteX={positionAbsoluteX || 0}
      positionAbsoluteY={positionAbsoluteY || 0}
    />
  );
};

export default memo(RetryNode);
