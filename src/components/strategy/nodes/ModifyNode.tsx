
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import ActionNodeContent from './action-node/ActionNodeContent';

interface ModifyNodeProps {
  data: {
    label: string;
    actionType: 'modify';
    targetPositionId?: string;
    targetNodeId?: string;
    modifications?: any;
    positions?: any[];
    startNodeSymbol?: string;
  };
  isConnectable: boolean;
  selected: boolean;
  id: string;
}

const ModifyNode = ({ data, isConnectable, selected, id }: ModifyNodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="nodrag"
      />
      <div className="px-2 py-1 rounded-md">
        <ActionNodeContent
          data={{
            label: data.label || 'Modify Position',
            actionType: 'modify',
            positions: data.positions || [],
            targetPositionId: data.targetPositionId,
            targetNodeId: data.targetNodeId,
            modifications: data.modifications,
          }}
          id={id}
          startNodeSymbol={data.startNodeSymbol}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="nodrag"
      />
    </>
  );
};

export default memo(ModifyNode);
