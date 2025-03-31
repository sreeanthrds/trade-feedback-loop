
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
      id="time-minutes"
      type="number"
      value={exitCondition.minutes === undefined ? '' : exitCondition.minutes}
      onChange={(e) => {
        // Handle empty input
        if (e.target.value === '') {
          updateField('minutes', undefined);
          return;
        }
        
        // Parse number value
        const minutes = parseInt(e.target.value);
        if (!isNaN(minutes)) {
          updateField('minutes', minutes);
        }
      }}
      min={1}
      description="Minutes after entry to exit position"
      required={true}
    />
  );
};

export default TimeBasedExitForm;
