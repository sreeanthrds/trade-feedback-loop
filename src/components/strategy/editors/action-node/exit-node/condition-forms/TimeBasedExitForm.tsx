
import React from 'react';
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
    <EnhancedNumberInput
      label="Minutes"
      id="time-minutes"
      value={exitCondition.minutes}
      onChange={(value) => updateField('minutes', value)}
      min={1}
      description="Minutes after entry to exit position"
      required={true}
    />
  );
};

export default TimeBasedExitForm;
