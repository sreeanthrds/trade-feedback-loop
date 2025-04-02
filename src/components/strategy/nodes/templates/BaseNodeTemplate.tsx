
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface BaseNodeTemplateProps extends NodeProps {
  data: {
    label: string;
    description?: string;
    icon?: React.ReactNode;
    [key: string]: any;
  };
  headerClassName?: string;
  contentClassName?: string;
  targetHandlePosition?: Position;
  sourceHandlePosition?: Position;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  children?: React.ReactNode;
}

/**
 * BaseNodeTemplate provides a consistent structure for all strategy node types
 * It handles common node elements like handles, headers, and content areas
 */
const BaseNodeTemplate: React.FC<BaseNodeTemplateProps> = ({
  id,
  data,
  selected,
  headerClassName,
  contentClassName,
  targetHandlePosition = Position.Left,
  sourceHandlePosition = Position.Right,
  showSourceHandle = true,
  showTargetHandle = true,
  children,
  isConnectable = true,
}) => {
  const {
    label,
    description,
    icon,
  } = data;

  return (
    <div className={cn(
      "px-3 py-2 rounded-md min-w-[120px]",
      selected ? "ring-2 ring-primary/50" : ""
    )}>
      {showTargetHandle && (
        <Handle
          type="target"
          position={targetHandlePosition}
          isConnectable={isConnectable}
          className="nodrag"
        />
      )}
      
      <div className={cn(
        "flex items-center gap-1.5",
        headerClassName
      )}>
        {icon && icon}
        <div className="font-medium text-sm">{label || id}</div>
      </div>
      
      {description && (
        <div className="text-xs text-muted-foreground mt-0.5">
          {description}
        </div>
      )}
      
      <div className={cn("mt-1", contentClassName)}>
        {children}
      </div>
      
      {showSourceHandle && (
        <Handle
          type="source"
          position={sourceHandlePosition}
          isConnectable={isConnectable}
          className="nodrag"
        />
      )}
      
      {/* Display node ID in small text */}
      <div className="text-[9px] text-muted-foreground mt-2 text-right">
        ID: {id}
      </div>
    </div>
  );
};

export default memo(BaseNodeTemplate);
