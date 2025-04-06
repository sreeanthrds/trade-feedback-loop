
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import { TakeProfitConfig } from '../exit-node/types';

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
  return (
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
  );
};

export default TakeProfitSection;
