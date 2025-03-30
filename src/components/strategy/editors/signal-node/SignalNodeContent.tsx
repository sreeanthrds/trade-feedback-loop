
import React from 'react';
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

interface SignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (updatedConditions: GroupCondition[]) => void;
}

const SignalNodeContent: React.FC<SignalNodeContentProps> = ({
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
        <h3 className="text-sm font-medium">Signal Conditions</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Build conditions that evaluate market data, indicators, positions, and more to trigger when specific criteria are met.
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
        />

        {totalConditions > 0 && (
          <div className="mt-4">
            <AdvancedFeatureToggle
              title="Condition Settings"
              description="Configure additional settings for your conditions"
            >
              <div className="space-y-2 mt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Evaluation Frequency</label>
                  <select className="w-full h-8 text-xs px-2 py-1 border border-border rounded-md bg-background">
                    <option value="tick">Every Tick</option>
                    <option value="bar">Bar Close</option>
                    <option value="minute">Every Minute</option>
                    <option value="custom">Custom...</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                    />
                    Require confirmation bar
                  </label>
                  <p className="text-[10px] text-muted-foreground">
                    Wait for the next bar to confirm the condition before triggering
                  </p>
                </div>
              </div>
            </AdvancedFeatureToggle>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalNodeContent;
