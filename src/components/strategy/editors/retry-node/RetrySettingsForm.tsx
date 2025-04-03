
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField } from '../../shared';

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
  const handleGroupNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onGroupNumberChange(value);
    }
  };

  const handleMaxReEntriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onMaxReEntriesChange(value);
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Retry Configuration</h3>
          
          <FormField label="Group Number" description="Retry nodes with the same group number share re-entry counts">
            <Input
              type="number"
              min="1"
              value={groupNumber}
              onChange={handleGroupNumberChange}
              className="w-full"
            />
          </FormField>
          
          <FormField label="Maximum Re-entries" description="How many times this position can be re-entered">
            <Input
              type="number"
              min="1"
              value={maxReEntries}
              onChange={handleMaxReEntriesChange}
              className="w-full"
            />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
};
