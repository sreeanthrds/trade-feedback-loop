
import React, { memo, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { TrendingDown } from 'lucide-react';
import { GroupCondition, groupConditionToString } from '../utils/conditionTypes';
import { useStrategyStore } from '@/hooks/use-strategy-store';

interface ExitSignalNodeData {
  label?: string;
  conditions?: GroupCondition[];
}

interface ExitSignalNodeProps {
  data: ExitSignalNodeData;
  id: string;
}

const ExitSignalNode = ({ data, id }: ExitSignalNodeProps) => {
  const strategyStore = useStrategyStore();
  const conditions = Array.isArray(data.conditions) ? data.conditions : [];
  
  // Determine if we have any conditions to display
  const hasExitConditions = conditions.length > 0 && 
    conditions[0].conditions && 
    conditions[0].conditions.length > 0;
  
  // Format complex conditions for display
  const exitConditionDisplay = useMemo(() => {
    if (!hasExitConditions) return null;
    
    try {
      // Find the start node to get indicator parameters
      const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
      
      // Pass start node data to the condition formatter
      return groupConditionToString(conditions[0], startNode?.data);
    } catch (error) {
      console.error("Error formatting exit conditions:", error);
      return "Invalid condition structure";
    }
  }, [hasExitConditions, conditions, strategyStore.nodes]);
  
  // Count total condition expressions for display
  const countConditions = (group: GroupCondition): number => {
    return group.conditions.reduce((total, cond) => {
      if ('groupLogic' in cond) {
        return total + countConditions(cond as GroupCondition);
      } else {
        return total + 1;
      }
    }, 0);
  };
  
  const exitConditionCount = hasExitConditions ? countConditions(conditions[0]) : 0;
  
  return (
    <div className="px-3 py-2 rounded-md shadow-sm bg-white dark:bg-gray-800 border border-amber-500 dark:border-amber-400 group hover:shadow-md transition-shadow duration-300">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#f59e0b' }}
      />
      
      <div className="flex items-center mb-1.5">
        <TrendingDown className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1.5" />
        <div className="font-medium text-xs text-amber-700 dark:text-amber-300">{data.label || "Exit"}</div>
      </div>
      
      {hasExitConditions && exitConditionDisplay ? (
        <div className="text-[10px] bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded-md mb-1.5 max-w-[180px] break-words">
          <div className="font-mono">
            {exitConditionDisplay}
          </div>
        </div>
      ) : (
        <div className="text-[10px] text-muted-foreground mb-1.5">
          No exit conditions set
        </div>
      )}
      
      <div className="flex flex-col gap-1 text-[9px]">
        {hasExitConditions && (
          <div className="text-amber-600 dark:text-amber-400">
            {exitConditionCount} exit condition{exitConditionCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      {/* Display node ID */}
      <div className="text-[9px] text-muted-foreground mt-1 text-right">
        ID: {id}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#f59e0b' }}
      />
    </div>
  );
};

export default memo(ExitSignalNode);
