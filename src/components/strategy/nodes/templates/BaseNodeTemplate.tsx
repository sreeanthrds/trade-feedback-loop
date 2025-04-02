
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface BaseNodeTemplateProps {
  id: string;
  data: {
    label: string;
    icon?: React.ReactNode;
    description?: string;
    [key: string]: any;
  };
  selected: boolean;
  isConnectable: boolean;
  type: string;
  zIndex: number;
  dragging: boolean;
  draggable: boolean;
  selectable: boolean;
  deletable: boolean;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  sourceHandlePosition?: Position;
  targetHandlePosition?: Position;
}

const BaseNodeTemplate = ({
  id,
  data,
  selected,
  isConnectable,
  type,
  zIndex = 0,
  dragging,
  draggable,
  selectable,
  deletable,
  positionAbsoluteX,
  positionAbsoluteY,
  showSourceHandle = true,
  showTargetHandle = true,
  sourceHandlePosition = Position.Bottom,
  targetHandlePosition = Position.Top,
}: BaseNodeTemplateProps) => {
  return (
    <>
      {showTargetHandle && (
        <Handle
          type="target"
          position={targetHandlePosition}
          isConnectable={isConnectable}
          style={{ visibility: isConnectable ? 'visible' : 'hidden' }}
        />
      )}
      
      <div className="px-3 py-2 rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center space-x-2">
          {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
          
          <div className="flex-1">
            <div className="font-medium">{data.label}</div>
            {data.description && (
              <div className="text-xs text-muted-foreground">
                {data.description}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-[9px] text-muted-foreground mt-1 text-right">
          ID: {id}
        </div>
      </div>
      
      {showSourceHandle && (
        <Handle
          type="source"
          position={sourceHandlePosition}
          isConnectable={isConnectable}
          style={{ visibility: isConnectable ? 'visible' : 'hidden' }}
        />
      )}
    </>
  );
};

export default memo(BaseNodeTemplate);
