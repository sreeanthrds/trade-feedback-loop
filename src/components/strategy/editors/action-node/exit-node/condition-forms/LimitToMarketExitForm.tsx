
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
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
    <EnhancedNumberInput
      label="Wait Seconds"
      id="wait-seconds"
      value={exitCondition.waitSeconds}
      onChange={(value) => updateField('waitSeconds', value)}
      min={1}
      description="Switch to market order after this many seconds"
    />
  );
};

export default LimitToMarketExitForm;
