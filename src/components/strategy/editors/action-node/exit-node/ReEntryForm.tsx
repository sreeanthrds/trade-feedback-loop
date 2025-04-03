
import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import SwitchField from '../../shared/SwitchField';

interface ReEntryFormProps {
  reEntryEnabled: boolean;
  groupNumber: number;
  maxReEntries: number;
  onReEntryToggle: (checked: boolean) => void;
  onGroupNumberChange: (value: number | undefined) => void;
  onMaxReEntriesChange: (value: number | undefined) => void;
}

const ReEntryForm: React.FC<ReEntryFormProps> = ({
  reEntryEnabled,
  groupNumber,
  maxReEntries,
  onReEntryToggle,
  onGroupNumberChange,
  onMaxReEntriesChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <RefreshCcw size={16} className={reEntryEnabled ? "text-primary" : "text-muted-foreground"} />
        <h3 className="text-sm font-medium">Re-Entry Settings</h3>
      </div>
      
      <SwitchField
        label="Enable Re-Entry"
        checked={reEntryEnabled}
        onCheckedChange={onReEntryToggle}
        description="Create a retry node to re-enter the market after exit"
      />
      
      {reEntryEnabled && (
        <>
          <EnhancedNumberInput
            label="Group Number"
            value={groupNumber}
            onChange={onGroupNumberChange}
            min={1}
            step={1}
            description="Exits with the same group number share re-entry counter"
          />
          
          <EnhancedNumberInput
            label="Max Re-Entries"
            value={maxReEntries}
            onChange={onMaxReEntriesChange}
            min={1}
            step={1}
            description="Maximum number of times positions can re-enter"
          />
        </>
      )}
    </div>
  );
};

export default ReEntryForm;
