
import React from 'react';
import { GroupCondition } from '../../../utils/conditions';
import ConditionBuilder from '../../condition-builder/ConditionBuilder';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ExitConditionsSectionProps {
  conditions: GroupCondition[];
  updateConditions: (updatedConditions: GroupCondition[]) => void;
}

const ExitConditionsSection: React.FC<ExitConditionsSectionProps> = ({
  conditions,
  updateConditions
}) => {
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

  const totalConditions = conditions[0] ? countConditions(conditions[0]) : 0;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium">Exit Conditions</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Define price targets, profit percentages, or market conditions that will trigger this exit.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-4">
        <ConditionBuilder 
          rootCondition={conditions[0]} 
          updateConditions={(updatedRoot) => {
            updateConditions([updatedRoot]);
          }}
          context="exit"
        />
      </div>
    </div>
  );
};

export default ExitConditionsSection;
