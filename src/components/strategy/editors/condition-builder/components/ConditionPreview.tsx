
import React, { useState } from 'react';
import { GroupCondition, groupConditionToString } from '../../../utils/conditionTypes';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConditionPreviewProps {
  rootCondition: GroupCondition;
  contextLabel?: string;
}

const ConditionPreview: React.FC<ConditionPreviewProps> = ({ 
  rootCondition,
  contextLabel = "When:"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const strategyStore = useStrategyStore();

  // Find start node to get indicator definitions
  const startNode = strategyStore.nodes.find(node => node.type === 'startNode');

  // Generate readable condition string
  // We'll try to catch any errors in case the condition structure is invalid
  let conditionString = "No conditions defined";
  try {
    if (rootCondition && rootCondition.conditions && rootCondition.conditions.length > 0) {
      conditionString = groupConditionToString(rootCondition, startNode?.data);
    }
  } catch (error) {
    console.error("Error in condition preview:", error);
    conditionString = "Invalid condition structure";
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Code className="h-3.5 w-3.5" />
          Condition Preview
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs p-0 px-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      
      <div className={`${isExpanded ? 'max-h-80' : 'max-h-32'} overflow-auto transition-all duration-300 bg-muted/40 rounded-md p-3`}>
        <div className="text-sm font-mono break-words">
          <span className="text-primary-foreground/70 font-semibold">{contextLabel} </span>
          {conditionString}
        </div>
      </div>
    </div>
  );
};

export default ConditionPreview;
