
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ActionNodeContent } from './action-node/ActionNodeContent';

const ModifyNode = ({ data, isConnectable, selected, id }) => {
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
          label={data.label || 'Modify Position'} 
          actionType="modify"
          selectedNode={selected}
          positions={data.positions || []}
          instrument={data.instrument}
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
