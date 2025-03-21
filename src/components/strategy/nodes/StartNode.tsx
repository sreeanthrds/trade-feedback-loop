
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';

const StartNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-2 rounded-md">
      <div className="flex items-center">
        <Play className="h-5 w-5 text-success mr-2" />
        <div>
          <div className="font-medium">{data.label || "Start"}</div>
          <div className="text-xs text-foreground/60">Strategy Entry Point</div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#4CAF50' }}
      />
    </div>
  );
};

export default memo(StartNode);
