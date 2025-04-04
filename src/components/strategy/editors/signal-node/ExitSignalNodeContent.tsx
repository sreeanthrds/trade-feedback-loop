
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConditionBuilder from '../condition-builder/ConditionBuilder';
import AdvancedFeatureToggle from '../condition-builder/components/AdvancedFeatureToggle';
import { GroupCondition } from '../../utils/conditionTypes';

interface ExitSignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (updatedConditions: GroupCondition[]) => void;
}

const ExitSignalNodeContent: React.FC<ExitSignalNodeContentProps> = ({
  conditions,
  updateConditions,
}) => {
  // State for evaluation frequency
  const [evalFrequency, setEvalFrequency] = useState('tick');
  
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

  const totalExitConditions = conditions[0] ? countConditions(conditions[0]) : 0;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300">Exit Signal Conditions</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Build exit conditions that determine when to close or reduce positions based on market conditions.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-4 border-l-2 border-amber-200 dark:border-amber-800/50 pl-3">
        <ConditionBuilder 
          rootCondition={conditions[0]} 
          updateConditions={(updatedRoot) => {
            updateConditions([updatedRoot]);
          }}
          conditionContext="exit"
        />

        {totalExitConditions > 0 && (
          <div className="mt-4">
            <AdvancedFeatureToggle
              title="Exit Condition Settings"
              description="Configure additional settings for your exit conditions"
            >
              <div className="space-y-2 mt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium flex items-center">
                    Evaluation Frequency
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <select 
                    className="w-full h-8 text-xs px-2 py-1 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    value={evalFrequency}
                    onChange={(e) => setEvalFrequency(e.target.value)}
                    required
                  >
                    <option value="tick">Every Tick</option>
                    <option value="bar">Bar Close</option>
                    <option value="minute">Every Minute</option>
                    <option value="custom">Custom...</option>
                  </select>
                </div>
              </div>
            </AdvancedFeatureToggle>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitSignalNodeContent;
