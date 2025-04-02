
import React, { memo } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import BaseNodeTemplate from './templates/BaseNodeTemplate';
import { getNodeIcon } from '../utils/nodes/nodeIcons';

const EndNode: React.FC<NodeProps> = ({ id, data, selected, isConnectable }) => {
  // Ensure data is properly structured with defaults
  const nodeData = {
    label: data.label || 'End',
    icon: getNodeIcon('endNode'),
    description: 'Strategy End Point'
  };

  return (
    <BaseNodeTemplate
      id={id}
      data={nodeData}
      selected={selected}
      isConnectable={isConnectable}
      showSourceHandle={false}
      targetHandlePosition={Position.Top}
    />
  );
};

export default memo(EndNode);
