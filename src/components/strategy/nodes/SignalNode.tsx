
import React, { memo, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Activity } from 'lucide-react';
import { GroupCondition, groupConditionToString } from '../utils/conditionTypes';
import { useStrategyStore } from '@/hooks/use-strategy-store';

interface SignalNodeData {
  label?: string;
  conditions?: GroupCondition[];
}

interface SignalNodeProps {
  data: SignalNodeData;
  id: string;
}

const SignalNode = ({ data, id }: SignalNodeProps) => {
  const strategyStore = useStrategyStore();
  const conditions = Array.isArray(data.conditions) ? data.conditions : [];
  
  // Determine if we have any conditions to display
  const hasConditions = conditions.length > 0 && 
    conditions[0].conditions && 
    conditions[0].conditions.length > 0;
  
  // Format complex conditions for display
  const conditionDisplay = useMemo(() => {
    if (!hasConditions) return null;
    
    try {
      // Find the start node to get indicator parameters
      const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
      
      // Pass start node data to the condition formatter
      return groupConditionToString(conditions[0], startNode?.data);
    } catch (error) {
      console.error("Error formatting conditions:", error);
      return "Invalid condition structure";
    }
  }, [hasConditions, conditions, strategyStore.nodes]);
  
  // Count total condition expressions for display
  const conditionCount = useMemo(() => {
    if (!hasConditions) return 0;
    
    // Function to count all conditions recursively
    const countConditions = (group: GroupCondition): number => {
      return group.conditions.reduce((total, cond) => {
        if ('groupLogic' in cond) {
          return total + countConditions(cond as GroupCondition);
        } else {
          return total + 1;
        }
      }, 0);
    };
    
    return countConditions(conditions[0]);
  }, [hasConditions, conditions]);
  
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
      
      {hasConditions && conditionCount > 0 && (
        <div className="text-[9px] text-muted-foreground mb-0.5">
          {conditionCount} condition{conditionCount !== 1 ? 's' : ''}
        </div>
      )}
      
      {/* Display node ID */}
      <div className="text-[9px] text-muted-foreground mt-1 text-right">
        ID: {id}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#2196F3' }}
      />
    </div>
  );
};

export default memo(SignalNode);
