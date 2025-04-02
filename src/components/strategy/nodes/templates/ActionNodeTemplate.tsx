
import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BaseNodeTemplate, { BaseNodeTemplateProps } from './BaseNodeTemplate';

export interface ActionNodeTemplateProps extends Omit<BaseNodeTemplateProps, 'data'> {
  data: {
    label: string;
    actionType: 'entry' | 'exit' | 'alert' | 'modify';
    positions?: any[];
    description?: string;
    icon: React.ReactNode;
    [key: string]: any;
  };
  renderContent?: (data: any) => React.ReactNode;
}

/**
 * ActionNodeTemplate provides a consistent structure for action-type nodes
 * like entry, exit, alert, and modify nodes
 */
const ActionNodeTemplate: React.FC<ActionNodeTemplateProps> = ({
  id,
  data,
  selected,
  renderContent,
  ...props
}) => {
  const renderDefaultContent = () => {
    const { positions = [], actionType } = data;

    switch (actionType) {
      case 'entry':
        return (
          positions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {positions.map((position, index) => (
                <TooltipProvider key={position.id || index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant={position.positionType === 'buy' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {position.positionType === 'buy' ? 'B' : 'S'} {position.lots || 1}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{position.vpi || `Position ${index + 1}`}</p>
                      <p>{position.positionType === 'buy' ? 'Buy' : 'Sell'} {position.lots || 1} lot(s)</p>
                      <p>{position.orderType} order</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No positions defined</div>
          )
        );
        
      case 'exit':
        return <div className="text-xs text-muted-foreground">Exit positions</div>;
        
      case 'alert':
        return <div className="text-xs text-muted-foreground">Send notification</div>;
        
      case 'modify':
        return (
          data.targetPositionId ? (
            <Badge variant="secondary" className="text-xs">
              Modify position
            </Badge>
          ) : (
            <div className="text-xs text-muted-foreground">No position selected</div>
          )
        );
        
      default:
        return null;
    }
  };

  const content = renderContent ? renderContent(data) : renderDefaultContent();

  // Add required props with defaults for NodeProps
  const nodeProps: BaseNodeTemplateProps = {
    id,
    data,
    selected: Boolean(selected),
    // Add the missing required properties with default values
    type: props.type || 'default',
    zIndex: props.zIndex || 0,
    dragging: props.dragging || false,
    selectable: props.selectable !== undefined ? props.selectable : true,
    deletable: props.deletable !== undefined ? props.deletable : true,
    draggable: props.draggable !== undefined ? props.draggable : true,
    positionAbsoluteX: props.positionAbsoluteX || 0,
    positionAbsoluteY: props.positionAbsoluteY || 0,
    isConnectable: props.isConnectable !== undefined ? props.isConnectable : true,
    // Include all other props
    ...props
  };

  return (
    <BaseNodeTemplate
      {...nodeProps}
    >
      {content}
    </BaseNodeTemplate>
  );
};

export default memo(ActionNodeTemplate);
