
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
    <div className="px-4 py-3 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-border">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#2196F3' }}
      />
      
      <div className="flex items-center mb-2">
        <Activity className="h-5 w-5 text-primary mr-2" />
        <div className="font-medium">{data.label || "Signal"}</div>
      </div>
      
      {hasConditions && conditionDisplay ? (
        <div className="text-xs bg-muted/50 p-2 rounded-md mb-2 max-w-[220px] break-words">
          <div className="font-mono">
            {conditionDisplay}
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground mb-2">
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
