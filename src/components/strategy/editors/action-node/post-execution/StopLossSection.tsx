
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import EnhancedRadioGroup from '@/components/ui/form/enhanced/EnhancedRadioGroup';
import { StopLossConfig, TriggerType } from '../exit-node/types';
import { DollarSign, PercentIcon, Hash } from 'lucide-react';

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
  // Set default trigger type if not available
  const triggerType = stopLoss.triggerType || 'percentage';

  const handleTriggerTypeChange = (value: string) => {
    handleStopLossParamChange({ triggerType: value as TriggerType });
  };

  const renderTriggerInput = () => {
    switch (triggerType) {
      case 'percentage':
        return (
          <EnhancedNumberInput
            label="Stop Percentage"
            value={stopLoss.stopPercentage}
            onChange={(value) => handleStopLossParamChange({ stopPercentage: value })}
            min={0.1}
            max={100}
            step={0.1}
            tooltip="Percentage below entry price for stop loss"
          />
        );
      case 'points':
        return (
          <EnhancedNumberInput
            label="Stop Points"
            value={stopLoss.stopPoints}
            onChange={(value) => handleStopLossParamChange({ stopPoints: value })}
            min={0.1}
            step={0.1}
            tooltip="Points below entry price for stop loss"
          />
        );
      case 'pnl':
        return (
          <EnhancedNumberInput
            label="Stop P&L"
            value={stopLoss.stopPnl}
            onChange={(value) => handleStopLossParamChange({ stopPnl: value })}
            min={0}
            step={100}
            tooltip="Maximum loss amount for stop loss trigger"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="pl-4 space-y-3 pt-1">
      <EnhancedRadioGroup
        label="Trigger Type"
        value={triggerType}
        onChange={handleTriggerTypeChange}
        options={[
          { value: 'percentage', label: 'Percentage' },
          { value: 'points', label: 'Points' },
          { value: 'pnl', label: 'P&L' },
        ]}
        layout="horizontal"
        tooltip="Type of measurement to use for stop loss"
      />
      
      {renderTriggerInput()}
      
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
