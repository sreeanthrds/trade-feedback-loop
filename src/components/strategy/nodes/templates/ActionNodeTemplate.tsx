
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import BaseNodeTemplate from './BaseNodeTemplate';
import ActionDetails from '../action-node/ActionDetails';
import ActionLabel from '../action-node/ActionLabel';
import ActionIcon from '../action-node/ActionIcon';
import { Position as PositionType } from '@/components/strategy/types/position-types';
import { RefreshCcw } from 'lucide-react';

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
  // Check if re-entry is enabled
  const hasReEntry = data?.reEntry?.enabled && data?.actionType === 'exit';
  const reEntryGroup = hasReEntry ? data.reEntry.groupNumber : 0;
  const maxReEntries = hasReEntry ? data.reEntry.maxReEntries : 0;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ visibility: isConnectable ? 'visible' : 'hidden' }}
      />
      
      <div className={`px-3 py-2 rounded-md border border-border bg-card shadow-sm max-w-xs`}>
        <div className="flex flex-col">
          {/* Add re-entry indicator next to the label */}
          <div className="flex items-center justify-between">
            <ActionLabel 
              label={data?.label} 
              description={data?.description} 
              actionType={data?.actionType} 
            />
            
            {hasReEntry && (
              <div 
                className="flex items-center text-xs text-primary/80 gap-1 ml-2"
                title={`Re-Entry Group ${reEntryGroup}: Max ${maxReEntries} re-entries`}
              >
                <RefreshCcw size={12} />
                <span>{reEntryGroup}/{maxReEntries}</span>
              </div>
            )}
          </div>
          
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
