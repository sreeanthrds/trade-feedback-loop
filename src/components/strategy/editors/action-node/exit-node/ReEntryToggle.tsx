
import React from 'react';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';

interface ReEntryToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const ReEntryToggle: React.FC<ReEntryToggleProps> = ({ enabled, onToggle }) => {
  return (
    <EnhancedSwitch
      label="Enable Position Re-Entry"
      checked={enabled}
      onCheckedChange={onToggle}
      tooltip="If enabled, a retry node will be created when the position is exited"
      description="Create a retry node to re-enter this position after exit"
      id="reentry-toggle"
    />
  );
};
