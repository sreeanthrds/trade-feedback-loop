
import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import ActionNodeTemplate from './templates/ActionNodeTemplate';
import { Pencil } from 'lucide-react';
import { Position } from '@/components/strategy/types/position-types';

const ModifyNode: React.FC<NodeProps> = ({ id, data, selected, isConnectable, type, zIndex, dragging, draggable, selectable, deletable, positionAbsoluteX, positionAbsoluteY }) => {
  // Ensure data is properly structured with defaults
  const positions = Array.isArray(data?.positions) ? data.positions : [];
  const targetPosition = data?.targetPositionId ? 
    { id: data.targetPositionId, sourceNodeId: data?.targetNodeId } as Position : 
    undefined;
  
  // If we have a target position ID but no positions array with that position,
  // create a positions array with a placeholder for the targeted position
  const nodePositions = targetPosition ? [targetPosition] : positions;
  
  const nodeData = {
    label: data?.label || 'Modify Position',
    actionType: 'modify' as const,
    positions: nodePositions,
    targetPositionId: data?.targetPositionId || '',
    targetNodeId: data?.targetNodeId || '',
    modifications: data?.modifications || {},
    icon: <Pencil className="h-4 w-4 text-amber-500 mr-1.5" />,
    description: 'Modify an existing position'
  };

  return (
    <ActionNodeTemplate
      id={id}
      data={nodeData}
      selected={selected}
      isConnectable={isConnectable}
      type={type || 'modifyNode'}
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

export default memo(ModifyNode);
