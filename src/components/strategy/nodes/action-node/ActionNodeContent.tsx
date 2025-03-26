
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import ActionIcon from './ActionIcon';
import ActionLabel from './ActionLabel';
import ActionDetails from './ActionDetails';
import { ActionNodeData } from './types';

interface ActionNodeContentProps {
  data: ActionNodeData;
  startNodeSymbol?: string;
}

const ActionNodeContent: React.FC<ActionNodeContentProps> = ({ data, startNodeSymbol }) => {
  return (
    <div className="px-4 py-2 rounded-md bg-background/95 border border-border/50">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#FF9800' }}
      />
      
      <div className="flex items-center mb-2">
        <ActionIcon data={data} />
        <div className="font-medium">
          <ActionLabel data={data} />
        </div>
      </div>
      
      <ActionDetails data={data} startNodeSymbol={startNodeSymbol} />
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#FF9800' }}
      />
    </div>
  );
};

export default ActionNodeContent;
