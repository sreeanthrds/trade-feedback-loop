
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Activity } from 'lucide-react';

const SignalNode = ({ data }: { data: any }) => {
  const conditions = data.conditions || [];
  
  return (
    <div className="px-4 py-2 rounded-md">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#2196F3' }}
      />
      
      <div className="flex items-center mb-2">
        <Activity className="h-5 w-5 text-primary mr-2" />
        <div className="font-medium">{data.label || "Signal"}</div>
      </div>
      
      {conditions.length > 0 ? (
        <div className="text-xs bg-background/50 p-2 rounded-md mb-2">
          {conditions.map((condition: string, index: number) => (
            <div key={index} className="mb-1 last:mb-0">
              {condition}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-foreground/60 mb-2">
          No conditions set
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#2196F3' }}
      />
    </div>
  );
};

export default memo(SignalNode);
