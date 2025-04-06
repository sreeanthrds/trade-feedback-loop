
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import { StopLossConfig } from '../exit-node/types';

interface StopLossSectionProps {
  stopLoss: StopLossConfig;
  handleStopLossParamChange: (updates: Partial<StopLossConfig>) => void;
  handleStopLossReEntryToggle: (enabled: boolean) => void;
  handleReEntryUpdate: (
    feature: 'stopLoss',
    updates: Partial<{ groupNumber: number, maxReEntries: number }>
  ) => void;
}

const StopLossSection: React.FC<StopLossSectionProps> = ({
  stopLoss,
  handleStopLossParamChange,
  handleStopLossReEntryToggle,
  handleReEntryUpdate
}) => {
  return (
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
  );
};

export default StopLossSection;
