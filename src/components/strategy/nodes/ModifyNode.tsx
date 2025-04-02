
import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import ActionNodeTemplate from './templates/ActionNodeTemplate';
import { getNodeIcon } from '../utils/nodes/nodeIcons';

const ModifyNode: React.FC<NodeProps> = ({ id, data, selected, isConnectable }) => {
  // Ensure data is properly structured with defaults
  const nodeData = {
    label: data?.label as string || 'Modify Position',
    actionType: 'modify' as const,
    positions: Array.isArray(data?.positions) ? data.positions : [],
    targetPositionId: data?.targetPositionId,
    targetNodeId: data?.targetNodeId,
    modifications: data?.modifications || {},
    icon: getNodeIcon('modify'),
    description: 'Modify an existing position'
  };

  return (
    <ActionNodeTemplate
      id={id}
      data={nodeData}
      selected={selected}
      isConnectable={isConnectable}
    />
  );
};

export default memo(ModifyNode);
