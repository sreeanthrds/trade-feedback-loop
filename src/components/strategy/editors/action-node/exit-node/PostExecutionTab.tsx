
import React from 'react';
import { Node } from '@xyflow/react';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import { Separator } from '@/components/ui/separator';
import { useExitNodeDefaults } from './hooks/useExitNodeDefaults';
import { usePostExecutionSettings } from './hooks/usePostExecutionSettings';
import StopLossSection from '../post-execution/StopLossSection';
import TrailingStopSection from '../post-execution/TrailingStopSection';
import TakeProfitSection from '../post-execution/TakeProfitSection';
import { createReEntryUpdateHandler } from '../post-execution/ReEntryHelpers';

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
    
    const currentConfig = {
      'stopLoss': stopLoss,
      'trailingStop': trailingStop,
      'takeProfit': takeProfit
    }[feature];
    
    const handler = handlers[feature];
    
    createReEntryUpdateHandler(feature, currentConfig, handler)(updates);
  }

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
          <StopLossSection
            stopLoss={stopLoss}
            handleStopLossParamChange={handleStopLossParamChange}
            handleStopLossReEntryToggle={handleStopLossReEntryToggle}
            handleReEntryUpdate={handleReEntryUpdate}
          />
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
          <TrailingStopSection
            trailingStop={trailingStop}
            handleTrailingStopParamChange={handleTrailingStopParamChange}
            handleTrailingStopReEntryToggle={handleTrailingStopReEntryToggle}
            handleReEntryUpdate={handleReEntryUpdate}
          />
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
          <TakeProfitSection
            takeProfit={takeProfit}
            handleTakeProfitParamChange={handleTakeProfitParamChange}
            handleTakeProfitReEntryToggle={handleTakeProfitReEntryToggle}
            handleReEntryUpdate={handleReEntryUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default PostExecutionTab;
