
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { SlidersHorizontal } from 'lucide-react';

const ActionNode = ({ data }: { data: any }) => {
  const action = data.action || 'No action defined';
  const instrument = data.instrument || 'Not selected';
  
  return (
    <div className="px-4 py-2 rounded-md">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#FF9800' }}
      />
      
      <div className="flex items-center mb-2">
        <SlidersHorizontal className="h-5 w-5 text-warning mr-2" />
        <div className="font-medium">{data.label || "Action"}</div>
      </div>
      
      <div className="text-xs bg-background/50 p-2 rounded-md mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-foreground/60">Type:</span>
          <span className="font-medium">{action}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Instrument:</span>
          <span className="font-medium">{instrument}</span>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#FF9800' }}
      />
    </div>
  );
};

export default memo(ActionNode);
