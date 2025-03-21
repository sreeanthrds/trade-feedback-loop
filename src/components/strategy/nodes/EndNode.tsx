
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { StopCircle } from 'lucide-react';

interface EndNodeProps {
  data: {
    label?: string;
  };
}

const EndNode = ({ data }: EndNodeProps) => {
  return (
    <div className="px-4 py-2 rounded-md">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#F44336' }}
      />
      
      <div className="flex items-center">
        <StopCircle className="h-5 w-5 text-danger mr-2" />
        <div>
          <div className="font-medium">{data.label || "End"}</div>
          <div className="text-xs text-foreground/60">Strategy End Point</div>
        </div>
      </div>
    </div>
  );
};

export default memo(EndNode);
