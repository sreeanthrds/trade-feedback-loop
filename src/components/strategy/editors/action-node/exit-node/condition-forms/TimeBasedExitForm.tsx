
import React from 'react';
import InputField from '../../../shared/InputField';
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
    <InputField
      label="Minutes"
      type="number"
      value={exitCondition.minutes || 30}
      onChange={(e) => updateField('minutes', parseInt(e.target.value))}
      min={1}
      description="Minutes after entry to exit position"
    />
  );
};

export default TimeBasedExitForm;
