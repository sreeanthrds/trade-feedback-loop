
import React, { memo, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Activity } from 'lucide-react';
import { GroupCondition, groupConditionToString, createEmptyGroupCondition } from '../utils/conditionTypes';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { getIndicatorNameForDisplay } from '../utils/indicatorUtils';

interface SignalNodeData {
  label?: string;
  conditions?: GroupCondition[];
}

const SignalNode = ({ data }: { data: SignalNodeData }) => {
  const strategyStore = useStrategyStore();
  
  // Ensure data is valid with default values
  const safeData = {
    label: data?.label || 'Signal',
    conditions: Array.isArray(data?.conditions) && data.conditions.length > 0 
      ? data.conditions 
      : [createEmptyGroupCondition()]
  };
  
  // Determine if we have any valid conditions to display
  const hasConditions = safeData.conditions.length > 0 && 
    safeData.conditions[0]?.conditions && 
    Array.isArray(safeData.conditions[0].conditions) &&
    safeData.conditions[0].conditions.length > 0;
  
  // Format complex conditions for display
  const conditionDisplay = useMemo(() => {
    if (!hasConditions) return null;
    
    try {
      // Find the start node to get indicator parameters
      const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
      
      // Ensure the first condition is a valid group condition
      const rootCondition = safeData.conditions[0];
      if (!rootCondition) return "No conditions defined";
      
      // Pass start node data to the condition formatter
      return groupConditionToString(rootCondition, startNode?.data);
    } catch (error) {
      console.error("Error formatting condition:", error);
      return "Invalid condition structure";
    }
  }, [hasConditions, safeData.conditions, strategyStore.nodes]);
  
  return (
    <div className="px-3 py-2 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-border">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#5F92CF' }}
      />
      
      <div className="flex items-center mb-1.5">
        <Activity className="h-4 w-4 text-primary mr-1.5" />
        <div className="font-medium text-xs">{safeData.label}</div>
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
        style={{ background: '#5F92CF' }}
      />
    </div>
  );
};

export default memo(SignalNode);
