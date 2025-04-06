
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import EnhancedRadioGroup from '@/components/ui/form/enhanced/EnhancedRadioGroup';
import { TakeProfitConfig, TriggerType } from '../exit-node/types';

interface TakeProfitSectionProps {
  takeProfit: TakeProfitConfig;
  handleTakeProfitParamChange: (updates: Partial<TakeProfitConfig>) => void;
  handleTakeProfitReEntryToggle: (enabled: boolean) => void;
  handleReEntryUpdate: (
    feature: 'takeProfit',
    updates: Partial<{ groupNumber: number, maxReEntries: number }>
  ) => void;
}

const TakeProfitSection: React.FC<TakeProfitSectionProps> = ({
  takeProfit,
  handleTakeProfitParamChange,
  handleTakeProfitReEntryToggle,
  handleReEntryUpdate
}) => {
  // Set default trigger type if not available
  const triggerType = takeProfit.triggerType || 'percentage';

  const handleTriggerTypeChange = (value: string) => {
    handleTakeProfitParamChange({ triggerType: value as TriggerType });
  };

  const renderTriggerInput = () => {
    switch (triggerType) {
      case 'percentage':
        return (
          <EnhancedNumberInput
            label="Target Percentage"
            value={takeProfit.targetPercentage}
            onChange={(value) => handleTakeProfitParamChange({ targetPercentage: value })}
            min={0.1}
            max={1000}
            step={0.1}
            tooltip="Percentage above entry price for take profit"
          />
        );
      case 'points':
        return (
          <EnhancedNumberInput
            label="Target Points"
            value={takeProfit.targetPoints}
            onChange={(value) => handleTakeProfitParamChange({ targetPoints: value })}
            min={0.1}
            step={0.1}
            tooltip="Points above entry price for take profit"
          />
        );
      case 'pnl':
        return (
          <EnhancedNumberInput
            label="Target P&L"
            value={takeProfit.targetPnl}
            onChange={(value) => handleTakeProfitParamChange({ targetPnl: value })}
            min={0}
            step={100}
            tooltip="Profit amount to trigger take profit"
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
        tooltip="Type of measurement to use for take profit"
      />
      
      {renderTriggerInput()}
      
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
  );
};

export default TakeProfitSection;
