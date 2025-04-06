
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import { TrailingStopConfig } from '../exit-node/types';

interface TrailingStopSectionProps {
  trailingStop: TrailingStopConfig;
  handleTrailingStopParamChange: (updates: Partial<TrailingStopConfig>) => void;
  handleTrailingStopReEntryToggle: (enabled: boolean) => void;
  handleReEntryUpdate: (
    feature: 'trailingStop',
    updates: Partial<{ groupNumber: number, maxReEntries: number }>
  ) => void;
}

const TrailingStopSection: React.FC<TrailingStopSectionProps> = ({
  trailingStop,
  handleTrailingStopParamChange,
  handleTrailingStopReEntryToggle,
  handleReEntryUpdate
}) => {
  return (
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
  );
};

export default TrailingStopSection;
