
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle } from 'lucide-react';

interface ForceEndNodeProps {
  data: {
    label?: string;
    closeAll?: boolean;
    message?: string;
  };
}

const ForceEndNode = ({ data }: ForceEndNodeProps) => {
  return (
    <div className="px-4 py-2 rounded-md">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#9C27B0' }}
      />
      
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
        <div>
          <div className="font-medium">{data.label || "Force End"}</div>
          <div className="text-xs text-foreground/60">Close All Positions</div>
        </div>
      </div>
    </div>
  );
};

export default memo(ForceEndNode);
