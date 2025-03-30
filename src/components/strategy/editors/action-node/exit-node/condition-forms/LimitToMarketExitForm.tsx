
import React from 'react';
import InputField from '../../../shared/InputField';
import { ExitWithFallback } from '../types';

interface LimitToMarketExitFormProps {
  exitCondition: ExitWithFallback;
  updateField: (field: string, value: any) => void;
}

const LimitToMarketExitForm: React.FC<LimitToMarketExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <InputField
      label="Wait Seconds"
      type="number"
      value={exitCondition.waitSeconds || 60}
      onChange={(e) => updateField('waitSeconds', parseInt(e.target.value))}
      min={1}
      description="Switch to market order after this many seconds"
    />
  );
};

export default LimitToMarketExitForm;
