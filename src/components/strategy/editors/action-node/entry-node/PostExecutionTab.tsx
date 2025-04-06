
import React from 'react';
import { Node } from '@xyflow/react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import { Separator } from '@/components/ui/separator';
import { useExitNodeDefaults } from '../exit-node/hooks/useExitNodeDefaults';
import { usePostExecutionSettings } from '../exit-node/hooks/usePostExecutionSettings';

interface PostExecutionTabProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const PostExecutionTab: React.FC<PostExecutionTabProps> = ({
  node,
  updateNodeData
}) => {
  const { defaultExitNodeData } = useExitNodeDefaults();
  
  const {
    stopLoss,
    trailingStop,
    takeProfit,
    handleStopLossToggle,
    handleTrailingStopToggle,
    handleTakeProfitToggle,
    handleStopLossReEntryToggle,
    handleTrailingStopReEntryToggle,
    handleTakeProfitReEntryToggle,
    handleStopLossParamChange,
    handleTrailingStopParamChange,
    handleTakeProfitParamChange
  } = usePostExecutionSettings({
    node,
    updateNodeData,
    defaultExitNodeData
  });

  // Enhanced toggle handlers for SL/TSL mutual exclusivity
  const handleSLToggle = (enabled: boolean) => {
    if (enabled && trailingStop.enabled) {
      // If enabling SL, disable TSL
      handleTrailingStopToggle(false);
    }
    // Toggle SL
    handleStopLossToggle(enabled);
  };

  const handleTSLToggle = (enabled: boolean) => {
    if (enabled && stopLoss.enabled) {
      // If enabling TSL, disable SL
      handleStopLossToggle(false);
    }
    // Toggle TSL
    handleTrailingStopToggle(enabled);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 bg-accent/5 rounded-md p-3">
        <EnhancedSwitch
          id="stop-loss-toggle"
          label="Stop Loss"
          checked={stopLoss.enabled}
          onCheckedChange={handleSLToggle}
          tooltip="Set a stop loss to automatically exit when price falls below a certain level. Cannot be used with Trailing Stop."
        />
        
        {stopLoss.enabled && (
          <div className="pl-4 space-y-3 pt-1">
            <EnhancedNumberInput
              label="Stop Percentage"
              value={stopLoss.stopPercentage}
              onChange={(value) => handleStopLossParamChange({ stopPercentage: value })}
              min={0.1}
              max={100}
              step={0.1}
              tooltip="Percentage below entry price for stop loss"
            />
            
            <div className="pt-1">
              <EnhancedSwitch
                id="stop-loss-reentry-toggle"
                label="Re-entry After Stop Loss"
                checked={stopLoss.reEntry?.enabled || false}
                onCheckedChange={handleStopLossReEntryToggle}
                tooltip="Re-enter the position after stop loss is triggered"
              />
              
              {stopLoss.reEntry?.enabled && (
                <div className="pl-4 space-y-3 pt-2">
                  <EnhancedNumberInput
                    label="Group Number"
                    value={stopLoss.reEntry?.groupNumber}
                    onChange={(value) => handleReEntryUpdate('stopLoss', { groupNumber: value })}
                    min={1}
                    step={1}
                    tooltip="Group number for re-entry coordination"
                  />
                  
                  <EnhancedNumberInput
                    label="Max Re-entries"
                    value={stopLoss.reEntry?.maxReEntries}
                    onChange={(value) => handleReEntryUpdate('stopLoss', { maxReEntries: value })}
                    min={1}
                    step={1}
                    tooltip="Maximum number of re-entries after stop loss"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Separator className="my-1" />
      
      <div className="space-y-4 bg-accent/5 rounded-md p-3">
        <EnhancedSwitch
          id="trailing-stop-toggle"
          label="Trailing Stop"
          checked={trailingStop.enabled}
          onCheckedChange={handleTSLToggle}
          tooltip="Set a trailing stop that follows the price movement. Cannot be used with regular Stop Loss."
        />
        
        {trailingStop.enabled && (
          <div className="pl-4 space-y-3 pt-1">
            <EnhancedNumberInput
              label="Initial Distance (%)"
              value={trailingStop.initialDistance}
              onChange={(value) => handleTrailingStopParamChange({ initialDistance: value })}
              min={0.1}
              max={100}
              step={0.1}
              tooltip="Initial distance for trailing stop in percentage"
            />
            
            <EnhancedNumberInput
              label="Step Size (%)"
              value={trailingStop.stepSize}
              onChange={(value) => handleTrailingStopParamChange({ stepSize: value })}
              min={0.1}
              max={10}
              step={0.1}
              tooltip="Step size for trailing stop adjustment"
            />
            
            <div className="pt-1">
              <EnhancedSwitch
                id="trailing-stop-reentry-toggle"
                label="Re-entry After Trailing Stop"
                checked={trailingStop.reEntry?.enabled || false}
                onCheckedChange={handleTrailingStopReEntryToggle}
                tooltip="Re-enter the position after trailing stop is triggered"
              />
              
              {trailingStop.reEntry?.enabled && (
                <div className="pl-4 space-y-3 pt-2">
                  <EnhancedNumberInput
                    label="Group Number"
                    value={trailingStop.reEntry?.groupNumber}
                    onChange={(value) => handleReEntryUpdate('trailingStop', { groupNumber: value })}
                    min={1}
                    step={1}
                    tooltip="Group number for re-entry coordination"
                  />
                  
                  <EnhancedNumberInput
                    label="Max Re-entries"
                    value={trailingStop.reEntry?.maxReEntries}
                    onChange={(value) => handleReEntryUpdate('trailingStop', { maxReEntries: value })}
                    min={1}
                    step={1}
                    tooltip="Maximum number of re-entries after trailing stop"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Separator className="my-1" />
      
      <div className="space-y-4 bg-accent/5 rounded-md p-3">
        <EnhancedSwitch
          id="take-profit-toggle"
          label="Take Profit"
          checked={takeProfit.enabled}
          onCheckedChange={handleTakeProfitToggle}
          tooltip="Set a take profit to automatically exit when price reaches a target"
        />
        
        {takeProfit.enabled && (
          <div className="pl-4 space-y-3 pt-1">
            <EnhancedNumberInput
              label="Target Percentage"
              value={takeProfit.targetPercentage}
              onChange={(value) => handleTakeProfitParamChange({ targetPercentage: value })}
              min={0.1}
              max={1000}
              step={0.1}
              tooltip="Percentage above entry price for take profit"
            />
            
            <div className="pt-1">
              <EnhancedSwitch
                id="take-profit-reentry-toggle"
                label="Re-entry After Take Profit"
                checked={takeProfit.reEntry?.enabled || false}
                onCheckedChange={handleTakeProfitReEntryToggle}
                tooltip="Re-enter the position after take profit is triggered"
              />
              
              {takeProfit.reEntry?.enabled && (
                <div className="pl-4 space-y-3 pt-2">
                  <EnhancedNumberInput
                    label="Group Number"
                    value={takeProfit.reEntry?.groupNumber}
                    onChange={(value) => handleReEntryUpdate('takeProfit', { groupNumber: value })}
                    min={1}
                    step={1}
                    tooltip="Group number for re-entry coordination"
                  />
                  
                  <EnhancedNumberInput
                    label="Max Re-entries"
                    value={takeProfit.reEntry?.maxReEntries}
                    onChange={(value) => handleReEntryUpdate('takeProfit', { maxReEntries: value })}
                    min={1}
                    step={1}
                    tooltip="Maximum number of re-entries after take profit"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Helper for re-entry updates
  function handleReEntryUpdate(
    feature: 'stopLoss' | 'trailingStop' | 'takeProfit',
    updates: Partial<{ groupNumber: number, maxReEntries: number }>
  ) {
    const handlers = {
      'stopLoss': handleStopLossParamChange,
      'trailingStop': handleTrailingStopParamChange,
      'takeProfit': handleTakeProfitParamChange
    };
    
    const handler = handlers[feature];
    const currentConfig = {
      'stopLoss': stopLoss,
      'trailingStop': trailingStop,
      'takeProfit': takeProfit
    }[feature];
    
    handler({
      reEntry: {
        ...currentConfig.reEntry,
        ...updates
      }
    });
  }
};

export default PostExecutionTab;
