
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConditionBuilder from '../condition-builder/ConditionBuilder';
import { GroupCondition } from '../../utils/conditionTypes';

interface SignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (updatedConditions: GroupCondition[]) => void;
}

const SignalNodeContent: React.FC<SignalNodeContentProps> = ({
  conditions,
  updateConditions
}) => {
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
        rootCondition={conditions[0]} 
        updateConditions={(updatedRoot) => {
          updateConditions([updatedRoot]);
        }}
      />
    </div>
  );
};

export default SignalNodeContent;
