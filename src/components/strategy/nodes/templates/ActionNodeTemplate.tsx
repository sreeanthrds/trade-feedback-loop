
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import BaseNodeTemplate from './BaseNodeTemplate';
import ActionDetails from '../action-node/ActionDetails';
import ActionLabel from '../action-node/ActionLabel';
import ActionIcon from '../action-node/ActionIcon';
import RetryIcon from '../action-node/RetryIcon';
import { Position as PositionType } from '@/components/strategy/types/position-types';

interface ActionNodeTemplateProps {
  id: string;
  data: {
    label?: string;
    actionType?: 'entry' | 'exit' | 'alert' | 'modify';
    positions?: PositionType[];
    icon?: React.ReactNode;
    description?: string;
    updateNodeData?: (id: string, data: any) => void;
    startNodeSymbol?: string;
    targetPositionId?: string; // Added for modify node
    targetNodeId?: string;     // Added for modify node
    modifications?: Record<string, any>; // Added for modify node
    // Add re-entry related props
    reEntry?: {
      enabled: boolean;
      groupNumber: number;
      maxReEntries: number;
    };
    // Internal action type for special handling
    _actionTypeInternal?: string;
    [key: string]: any;
  };
  selected: boolean;
  isConnectable: boolean;
  type: string;
  zIndex?: number;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  positionAbsoluteX?: number;
  positionAbsoluteY?: number;
}

const ActionNodeTemplate = ({
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
}: ActionNodeTemplateProps) => {
  // Check if this is specifically a retry node by looking at the internal action type
  const isRetryNode = data?._actionTypeInternal === 'retry';
  
  // Only show retry icon on retry nodes, not exit nodes
  const showRetryIcon = isRetryNode;
  
  // Get retry-specific properties if available
  const retryGroupNumber = data?.retryConfig?.groupNumber || 1;
  const retryMaxEntries = data?.retryConfig?.maxReEntries || 1;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ visibility: isConnectable ? 'visible' : 'hidden' }}
      />
      
      <div className={`px-3 py-2 rounded-md border border-border bg-card shadow-sm max-w-xs relative`}>
        {/* Only show the RetryIcon for retry nodes */}
        {showRetryIcon && (
          <RetryIcon 
            enabled={true} 
            groupNumber={retryGroupNumber} 
            maxReEntries={retryMaxEntries} 
          />
        )}
        
        <div className="flex flex-col">
          <ActionLabel 
            label={data?.label} 
            description={data?.description} 
            actionType={data?.actionType} 
          />
          
          <ActionIcon 
            icon={data?.icon} 
            actionType={data?.actionType} 
          />
          
          <ActionDetails 
            positions={data?.positions} 
            actionType={data?.actionType}
            nodeId={id}
            startNodeSymbol={data?.startNodeSymbol}
            targetPositionId={data?.targetPositionId}
            targetNodeId={data?.targetNodeId}
            modifications={data?.modifications}
          />
          
          <div className="text-[9px] text-muted-foreground mt-1 text-right">
            ID: {id}
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ visibility: isConnectable ? 'visible' : 'hidden' }}
      />
    </>
  );
};

export default memo(ActionNodeTemplate);
