
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import BaseNodeTemplate from './BaseNodeTemplate';
import ActionDetails from '../action-node/ActionDetails';
import ActionLabel from '../action-node/ActionLabel';
import ActionIcon from '../action-node/ActionIcon';
import { Position as PositionType } from '@/components/strategy/types/position-types';

interface ActionNodeTemplateProps {
  id: string;
  data: {
    label: string;
    actionType: 'entry' | 'exit' | 'alert' | 'modify';
    positions?: PositionType[];
    icon?: React.ReactNode;
    description?: string;
    updateNodeData?: (id: string, data: any) => void;
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
