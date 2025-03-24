
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
    <div className="px-3 py-2 rounded-md">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#F44336' }}
      />
      
      <div className="flex items-center">
        <StopCircle className="h-4 w-4 text-rose-600 dark:text-rose-500 mr-1.5" />
        <div>
          <div className="font-medium text-xs">{data.label || "End"}</div>
          <div className="text-[10px] text-foreground/60">Strategy End Point</div>
        </div>
      </div>
    </div>
  );
};

export default memo(EndNode);
