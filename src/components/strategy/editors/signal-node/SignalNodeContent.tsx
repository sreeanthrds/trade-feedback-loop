import React, { useState, useEffect } from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ConditionBuilder from '../condition-builder/ConditionBuilder';
import AdvancedFeatureToggle from '../condition-builder/components/AdvancedFeatureToggle';
import { GroupCondition } from '../../utils/conditionTypes';

interface SignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (updatedConditions: GroupCondition[]) => void;
  exitConditions?: GroupCondition[];
  updateExitConditions?: (updatedConditions: GroupCondition[]) => void;
}

const SignalNodeContent: React.FC<SignalNodeContentProps> = ({
  conditions,
  updateConditions,
  exitConditions = [],
  updateExitConditions
}) => {
  // State for evaluation frequency
  const [evalFrequency, setEvalFrequency] = useState('tick');
  const [requireConfirmation, setRequireConfirmation] = useState(false);
  
  // For tabs management
  const [activeTab, setActiveTab] = useState('entry');
  
  // Ensure we have at least one exit condition with proper typing
  const safeExitConditions: GroupCondition[] = exitConditions.length > 0 
    ? exitConditions 
    : [
        {
          id: 'exit-root',
          groupLogic: 'AND' as const, // Explicitly typing as "AND" | "OR"
          conditions: []
        }
      ];
  
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

  const totalEntryConditions = conditions[0] ? countConditions(conditions[0]) : 0;
  const totalExitConditions = safeExitConditions[0] ? countConditions(safeExitConditions[0]) : 0;

  // Check if entry or exit conditions have been defined
  const hasEntryConditions = totalEntryConditions > 0;
  const hasExitConditions = totalExitConditions > 0;

  // Determine if tab switching should be disabled
  useEffect(() => {
    // If user has already built conditions in one tab, keep them in that tab
    if (hasEntryConditions && activeTab !== 'entry') {
      setActiveTab('entry');
    } else if (hasExitConditions && activeTab !== 'exit') {
      setActiveTab('exit');
    }
  }, [hasEntryConditions, hasExitConditions]);

  // Handle exit condition updates
  const handleExitConditionsUpdate = (updatedRoot: GroupCondition) => {
    if (updateExitConditions) {
      updateExitConditions([updatedRoot]);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger 
            value="entry" 
            className={`${activeTab === 'entry' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : ''}`}
            disabled={hasExitConditions}
          >
            Entry Signal
            {hasEntryConditions && (
              <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded-full">
                {totalEntryConditions}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="exit"
            className={`${activeTab === 'exit' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200' : ''}`} 
            disabled={hasEntryConditions}
          >
            Exit Signal
            {hasExitConditions && (
              <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded-full">
                {totalExitConditions}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        {(hasEntryConditions && hasExitConditions) || (hasEntryConditions && activeTab === 'exit') || (hasExitConditions && activeTab === 'entry') ? (
          <Alert variant="default" className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm">
              {activeTab === 'entry' ? 
                "You've already defined exit conditions. To modify entry conditions, create a new signal node." :
                "You've already defined entry conditions. To modify exit conditions, create a new signal node."}
            </AlertDescription>
          </Alert>
        ) : null}
        
        <TabsContent value="entry" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Entry Signal Conditions</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Build entry conditions that evaluate market data, indicators, and more to determine when to enter a position.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-4 border-l-2 border-emerald-200 dark:border-emerald-800/50 pl-3">
            <ConditionBuilder 
              rootCondition={conditions[0]} 
              updateConditions={(updatedRoot) => {
                updateConditions([updatedRoot]);
              }}
              conditionContext="entry"
            />

            {totalEntryConditions > 0 && (
              <div className="mt-4">
                <AdvancedFeatureToggle
                  title="Entry Condition Settings"
                  description="Configure additional settings for your entry conditions"
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
                    
                    <div className="space-y-1">
                      <label className="text-xs font-medium">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={requireConfirmation}
                          onChange={(e) => setRequireConfirmation(e.target.checked)}
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
        </TabsContent>
        
        <TabsContent value="exit" className="space-y-4">
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
              rootCondition={safeExitConditions[0]} 
              updateConditions={handleExitConditionsUpdate}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignalNodeContent;
