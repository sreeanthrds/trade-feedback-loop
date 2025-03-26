
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConditionBuilder from '../condition-builder/ConditionBuilder';
import { GroupCondition, createEmptyGroupCondition } from '../../utils/conditionTypes';

interface SignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (updatedConditions: GroupCondition[]) => void;
}

const SignalNodeContent: React.FC<SignalNodeContentProps> = ({
  conditions,
  updateConditions
}) => {
  // Create default condition if none exists or conditions is not an array
  const safeConditions = Array.isArray(conditions) && conditions.length > 0
    ? conditions
    : [createEmptyGroupCondition()];
  
  // Ensure the first condition is a valid group condition with all required properties
  const rootCondition = safeConditions[0];
  
  // Ensure rootCondition has all necessary properties of a GroupCondition
  const validRootCondition: GroupCondition = {
    id: rootCondition?.id || `group_${Math.random().toString(36).substr(2, 9)}`,
    groupLogic: rootCondition?.groupLogic || 'AND',
    conditions: Array.isArray(rootCondition?.conditions) ? rootCondition.conditions : []
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium">Condition Builder</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Build complex conditions with nested groups, indicators, and operators.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <ConditionBuilder 
        rootCondition={validRootCondition} 
        updateConditions={(updatedRoot) => {
          if (updatedRoot) {
            updateConditions([updatedRoot]);
          }
        }}
      />
    </div>
  );
};

export default SignalNodeContent;
