
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState("builder");

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
      
      <Tabs defaultValue="builder" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="builder">Visual Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="space-y-4 pt-4">
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
        </TabsContent>
        
        <TabsContent value="templates" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { 
                name: "Price Crossover", 
                description: "Price crosses above/below an indicator",
                complexity: "Basic"
              },
              { 
                name: "RSI Condition", 
                description: "RSI enters overbought/oversold territory",
                complexity: "Basic"
              },
              { 
                name: "MACD Signal", 
                description: "MACD line crosses signal line",
                complexity: "Intermediate"
              },
              { 
                name: "Multiple Indicator", 
                description: "Combine multiple indicators in one condition",
                complexity: "Advanced"
              },
              { 
                name: "Bollinger Band", 
                description: "Price touches or crosses Bollinger Bands",
                complexity: "Intermediate"
              },
              { 
                name: "Volume Spike", 
                description: "Detects abnormal volume increase",
                complexity: "Intermediate"
              }
            ].map((template, i) => (
              <div 
                key={i}
                className="border border-border p-3 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  // In a real implementation, this would load a template
                  setActiveTab("builder");
                }}
              >
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
                <div className="text-[10px] text-primary mt-1">{template.complexity}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SignalNodeContent;
