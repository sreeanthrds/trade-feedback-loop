
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';

interface RetrySettingsFormProps {
  groupNumber: number;
  maxReEntries: number;
  onGroupNumberChange: (value: number) => void;
  onMaxReEntriesChange: (value: number) => void;
}

export const RetrySettingsForm: React.FC<RetrySettingsFormProps> = ({
  groupNumber,
  maxReEntries,
  onGroupNumberChange,
  onMaxReEntriesChange
}) => {
  return (
    <div className="space-y-4 pt-2">
      <EnhancedNumberInput
        label="Group Number"
        value={groupNumber}
        onChange={(value) => onGroupNumberChange(value || 1)}
        min={1}
        step={1}
        description="Retry nodes with the same group number share re-entry counter"
      />
      
      <EnhancedNumberInput
        label="Max Re-Entries"
        value={maxReEntries}
        onChange={(value) => onMaxReEntriesChange(value || 1)}
        min={1}
        step={1}
        description="Maximum number of times positions can re-enter"
      />
    </div>
  );
};
