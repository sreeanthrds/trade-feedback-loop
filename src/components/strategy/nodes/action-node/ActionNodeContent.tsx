
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ActionNodeData, Position as PositionType } from './types';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface ActionNodeContentProps {
  data: ActionNodeData;
  startNodeSymbol?: string;
  isSymbolMissing?: boolean;
  id: string;
  updateNodeData?: (id: string, data: Partial<ActionNodeData>) => void;
}

const ActionNodeContent: React.FC<ActionNodeContentProps> = ({ 
  data, 
  startNodeSymbol,
  isSymbolMissing,
  id,
  updateNodeData
}) => {
  const sortedPositions = [...(data.positions || [])].sort((a, b) => a.priority - b.priority);
  
  return (
    <div className={`px-4 py-2 rounded-md bg-background/95 border ${isSymbolMissing ? 'border-destructive/50' : 'border-border/50'}`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#FF9800' }}
      />
      
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded mr-2">
          {data.actionType === 'entry' ? '➡️' : data.actionType === 'exit' ? '⬅️' : '🔔'}
        </div>
        <div className="font-medium">
          {data.label || (data.actionType === 'entry' ? 'Enter Position' : 
                         data.actionType === 'exit' ? 'Exit Position' : 'Alert')}
        </div>
      </div>
      
      {isSymbolMissing && (
        <div className="flex items-center gap-1 py-1 px-2 bg-destructive/10 rounded text-destructive text-xs mb-2">
          <AlertTriangle className="h-3 w-3" />
          <span>Missing instrument</span>
        </div>
      )}
      
      {/* Display multiple positions */}
      {sortedPositions.length > 0 ? (
        <div className="space-y-2">
          {sortedPositions.map((position, index) => (
            <div key={position.id} className="text-xs border-t pt-1 first:border-t-0 first:pt-0">
              <div className="flex justify-between items-center">
                <span className="font-medium">Position {index + 1}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    Priority: {position.priority}
                  </span>
                  {updateNodeData && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5" 
                      onClick={() => {}}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span>{position.positionType === 'buy' ? 'Buy' : 'Sell'}</span>
                <span>{position.lots || 1} lot{(position.lots || 1) > 1 ? 's' : ''}</span>
                {position.vpi && (
                  <span className="text-xs bg-primary/10 px-1 rounded overflow-hidden text-ellipsis max-w-[120px]" title={position.vpi}>
                    VPI: {position.vpi}
                  </span>
                )}
                {position.vpt && (
                  <span className="text-xs bg-secondary/10 px-1 rounded overflow-hidden text-ellipsis max-w-[120px]" title={position.vpt}>
                    Tag: {position.vpt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm">
          {data.actionType === 'alert' ? 'Notification Alert' : 'No position details'}
        </div>
      )}
      
      {/* Display node ID */}
      <div className="text-[9px] text-muted-foreground mt-2 text-right">
        ID: {id}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#FF9800' }}
      />
    </div>
  );
};

export default ActionNodeContent;
