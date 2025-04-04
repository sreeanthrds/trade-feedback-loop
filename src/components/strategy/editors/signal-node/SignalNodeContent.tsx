
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
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
  updateConditions: (conditions: GroupCondition[]) => void;
  exitConditions?: GroupCondition[];
  updateExitConditions?: (conditions: GroupCondition[]) => void;
  conditionContext?: 'entry' | 'exit';
  showTabSelector?: boolean;
}

const SignalNodeContent: React.FC<SignalNodeContentProps> = ({
  conditions,
  updateConditions,
  exitConditions,
  updateExitConditions,
  conditionContext = 'entry',
  showTabSelector = true,
}) => {
  const [activeTab, setActiveTab] = useState<string>(conditionContext || 'entry');
  
  const handleUpdateConditions = (updatedCondition: GroupCondition) => {
    updateConditions([updatedCondition]);
  };
  
  const handleUpdateExitConditions = (updatedCondition: GroupCondition) => {
    if (updateExitConditions) {
      updateExitConditions([updatedCondition]);
    }
  };

  // For single context (entry or exit only), don't show tabs
  if (!showTabSelector) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {conditionContext === 'entry' ? 'Entry Conditions' : 'Exit Conditions'}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="end" className="max-w-sm">
                  {conditionContext === 'entry'
                    ? 'Define conditions that will trigger an entry signal when they are met.'
                    : 'Define conditions that will trigger an exit signal when they are met.'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {conditionContext === 'entry'
              ? 'When these conditions are met, this node will emit an entry signal.'
              : 'When these conditions are met, this node will emit an exit signal.'}
          </p>
        </div>
        
        <ConditionBuilder
          rootCondition={conditions[0] || { id: 'root', groupLogic: 'AND', conditions: [] }}
          updateConditions={handleUpdateConditions}
          context={conditionContext}
        />
      </div>
    );
  }

  // For combined signal node with both entry and exit tabs
  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="entry" className="text-xs">
            Entry Conditions
          </TabsTrigger>
          <TabsTrigger value="exit" className="text-xs">
            Exit Conditions
          </TabsTrigger>
        </TabsList>
        
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side="top" align="end" className="max-w-sm">
            <p className="text-sm">
              {activeTab === 'entry'
                ? 'Entry conditions define when your strategy should look for entry opportunities.'
                : 'Exit conditions define when your strategy should exit existing positions.'}
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>

      <TabsContent value="entry" className="space-y-4">
        <p className="text-xs text-muted-foreground">
          When these conditions are met, this node will emit an entry signal.
        </p>
        <ConditionBuilder
          rootCondition={conditions[0] || { id: 'root', groupLogic: 'AND', conditions: [] }}
          updateConditions={handleUpdateConditions}
          context="entry"
        />
      </TabsContent>
      
      <TabsContent value="exit" className="space-y-4">
        <p className="text-xs text-muted-foreground">
          When these conditions are met, this node will emit an exit signal.
        </p>
        <ConditionBuilder
          rootCondition={(exitConditions && exitConditions[0]) || { id: 'root', groupLogic: 'AND', conditions: [] }}
          updateConditions={handleUpdateExitConditions}
          context="exit"
        />
      </TabsContent>
    </Tabs>
  );
};

export default SignalNodeContent;
