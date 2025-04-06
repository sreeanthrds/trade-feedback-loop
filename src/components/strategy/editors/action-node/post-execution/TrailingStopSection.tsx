
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import EnhancedRadioGroup from '@/components/ui/form/enhanced/EnhancedRadioGroup';
import { TrailingStopConfig, TriggerType } from '../exit-node/types';

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
  // Set default trigger type if not available
  const triggerType = trailingStop.triggerType || 'percentage';

  const handleTriggerTypeChange = (value: string) => {
    handleTrailingStopParamChange({ triggerType: value as TriggerType });
  };

  const renderInitialDistanceInput = () => {
    switch (triggerType) {
      case 'percentage':
        return (
          <EnhancedNumberInput
            label="Initial Distance (%)"
            value={trailingStop.initialDistance}
            onChange={(value) => handleTrailingStopParamChange({ initialDistance: value })}
            min={0.1}
            max={100}
            step={0.1}
            tooltip="Initial distance for trailing stop in percentage"
          />
        );
      case 'points':
        return (
          <EnhancedNumberInput
            label="Initial Points"
            value={trailingStop.initialPoints}
            onChange={(value) => handleTrailingStopParamChange({ initialPoints: value })}
            min={0.1}
            step={0.1}
            tooltip="Initial distance for trailing stop in points"
          />
        );
      case 'pnl':
        return (
          <EnhancedNumberInput
            label="Initial P&L"
            value={trailingStop.initialPnl}
            onChange={(value) => handleTrailingStopParamChange({ initialPnl: value })}
            min={0}
            step={100}
            tooltip="Initial P&L threshold for trailing stop"
          />
        );
      default:
        return null;
    }
  };

  const renderStepSizeInput = () => {
    switch (triggerType) {
      case 'percentage':
        return (
          <EnhancedNumberInput
            label="Step Size (%)"
            value={trailingStop.stepSize}
            onChange={(value) => handleTrailingStopParamChange({ stepSize: value })}
            min={0.1}
            max={10}
            step={0.1}
            tooltip="Step size for trailing stop adjustment"
          />
        );
      case 'points':
        return (
          <EnhancedNumberInput
            label="Points Step Size"
            value={trailingStop.pointsStepSize}
            onChange={(value) => handleTrailingStopParamChange({ pointsStepSize: value })}
            min={0.1}
            step={0.1}
            tooltip="Step size in points for trailing stop adjustment"
          />
        );
      case 'pnl':
        return (
          <EnhancedNumberInput
            label="P&L Step Size"
            value={trailingStop.pnlStepSize}
            onChange={(value) => handleTrailingStopParamChange({ pnlStepSize: value })}
            min={0}
            step={100}
            tooltip="Step size in P&L for trailing stop adjustment"
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
        tooltip="Type of measurement to use for trailing stop"
      />
      
      {renderInitialDistanceInput()}
      {renderStepSizeInput()}
      
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
