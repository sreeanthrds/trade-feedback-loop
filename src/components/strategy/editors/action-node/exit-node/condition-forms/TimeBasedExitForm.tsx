
import React from 'react';
import { Label } from '@/components/ui/label';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import { ExitByTime } from '../types';

interface TimeBasedExitFormProps {
  exitCondition: ExitByTime;
  updateField: (field: string, value: any) => void;
}

const TimeBasedExitForm: React.FC<TimeBasedExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="time-minutes" className="flex items-center">
        Minutes
        <span className="ml-1 text-red-500">*</span>
      </Label>
      <EnhancedNumberInput
        id="time-minutes"
        value={exitCondition.minutes}
        onChange={(value) => updateField('minutes', value)}
        min={1}
        description="Minutes after entry to exit position"
        required={true}
      />
    </div>
  );
};

export default TimeBasedExitForm;
