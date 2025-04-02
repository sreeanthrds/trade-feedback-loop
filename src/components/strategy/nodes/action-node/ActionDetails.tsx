
import React from 'react';
import { Position } from '@/components/strategy/types/position-types';

interface ActionDetailsProps {
  positions?: Position[];
  actionType?: 'entry' | 'exit' | 'alert' | 'modify';
  nodeId: string;
  startNodeSymbol?: string;
  targetPositionId?: string;
  targetNodeId?: string;
  modifications?: Record<string, any>;
}

const ActionDetails: React.FC<ActionDetailsProps> = ({
  positions,
  actionType,
  nodeId,
  startNodeSymbol,
  targetPositionId,
  targetNodeId,
  modifications
}) => {
  if (!actionType) return null;

  // This is just a placeholder, actual implementations would vary based on your app's needs
  return (
    <div className="mt-1 text-xs w-full">
      {/* ENTRY NODE */}
      {actionType === 'entry' && Array.isArray(positions) && positions.length > 0 && (
        <div className="space-y-1">
          {positions.map((position, index) => (
            <div key={position.id || index} className="flex justify-between text-muted-foreground">
              <span>{position.positionType === 'buy' ? '▲ Buy' : '▼ Sell'}</span>
              <span>{position.lots || 1} lot{(position.lots || 1) > 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      )}

      {/* EXIT NODE */}
      {actionType === 'exit' && (
        <div className="text-muted-foreground">
          {Array.isArray(positions) && positions.length > 0 ? (
            <div>Exit {positions.length} position{positions.length > 1 ? 's' : ''}</div>
          ) : (
            <div>Exit all positions</div>
          )}
        </div>
      )}

      {/* ALERT NODE */}
      {actionType === 'alert' && (
        <div className="text-muted-foreground">
          Notification alert
        </div>
      )}

      {/* MODIFY NODE */}
      {actionType === 'modify' && (
        <div className="text-muted-foreground">
          {targetPositionId ? (
            <div className="flex justify-between">
              <span>Modify position</span>
              <span className="text-primary/70">{targetPositionId}</span>
            </div>
          ) : (
            <div>No position selected</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionDetails;
