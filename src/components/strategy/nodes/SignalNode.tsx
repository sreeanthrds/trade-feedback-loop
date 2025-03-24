
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Activity } from 'lucide-react';
import { GroupCondition, groupConditionToString } from '../utils/conditionTypes';

interface SignalNodeData {
  label?: string;
  conditions?: GroupCondition[];
}

const SignalNode = ({ data }: { data: SignalNodeData }) => {
  const conditions = Array.isArray(data.conditions) ? data.conditions : [];
  
  // Determine if we have any conditions to display
  const hasConditions = conditions.length > 0 && 
    conditions[0].conditions && 
    conditions[0].conditions.length > 0;
  
  // Format complex conditions for display
  const getConditionsDisplay = () => {
    if (!hasConditions) return null;
    
    try {
      return groupConditionToString(conditions[0]);
    } catch (error) {
      return "Invalid condition structure";
    }
  };
  
  const conditionDisplay = getConditionsDisplay();
  
  return (
    <div className="px-3 py-2 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-border">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#2196F3' }}
      />
      
      <div className="flex items-center mb-1.5">
        <Activity className="h-4 w-4 text-primary mr-1.5" />
        <div className="font-medium text-xs">{data.label || "Signal"}</div>
      </div>
      
      {hasConditions && conditionDisplay ? (
        <div className="text-[10px] bg-muted/50 p-1.5 rounded-md mb-1.5 max-w-[180px] break-words">
          <div className="font-mono">
            {conditionDisplay}
          </div>
        </div>
      ) : (
        <div className="text-[10px] text-muted-foreground mb-1.5">
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
