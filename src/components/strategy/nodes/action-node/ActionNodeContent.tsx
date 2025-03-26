
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import ActionIcon from './ActionIcon';
import ActionLabel from './ActionLabel';
import ActionDetails from './ActionDetails';
import { ActionNodeData } from './types';
import { AlertTriangle } from 'lucide-react';

interface ActionNodeContentProps {
  data: ActionNodeData;
  startNodeSymbol?: string;
  isSymbolMissing?: boolean;
}

const ActionNodeContent: React.FC<ActionNodeContentProps> = ({ 
  data, 
  startNodeSymbol,
  isSymbolMissing 
}) => {
  return (
    <div className={`px-4 py-2 rounded-md bg-background/95 border ${isSymbolMissing ? 'border-destructive/50' : 'border-border/50'}`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#FF9800' }}
      />
      
      <div className="flex items-center mb-2">
        <ActionIcon data={data} />
        <div className="font-medium">
          <ActionLabel data={data} />
        </div>
      </div>
      
      {isSymbolMissing && (
        <div className="flex items-center gap-1 py-1 px-2 bg-destructive/10 rounded text-destructive text-xs mb-2">
          <AlertTriangle className="h-3 w-3" />
          <span>Missing instrument</span>
        </div>
      )}
      
      <ActionDetails data={data} startNodeSymbol={startNodeSymbol} />
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#FF9800' }}
      />
    </div>
  );
};

export default ActionNodeContent;
