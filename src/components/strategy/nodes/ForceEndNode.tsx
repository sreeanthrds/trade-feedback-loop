
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle } from 'lucide-react';

interface ForceEndNodeProps {
  data: {
    label?: string;
    closeAll?: boolean;
    message?: string;
  };
  id: string;
}

const ForceEndNode = ({ data, id }: ForceEndNodeProps) => {
  return (
    <div className="px-3 py-2 rounded-md">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#9C27B0' }}
      />
      
      <div className="flex items-center">
        <AlertTriangle className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-1.5" />
        <div>
          <div className="font-medium text-xs">{data.label || "Force End"}</div>
          <div className="text-[10px] text-foreground/60">Close All Positions</div>
        </div>
      </div>
      
      {/* Display node ID */}
      <div className="text-[9px] text-muted-foreground mt-2 text-right">
        ID: {id}
      </div>
    </div>
  );
};

export default memo(ForceEndNode);
