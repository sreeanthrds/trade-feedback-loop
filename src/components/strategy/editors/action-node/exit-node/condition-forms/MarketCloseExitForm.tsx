
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import { ExitBeforeMarketClose } from '../types';

interface MarketCloseExitFormProps {
  exitCondition: ExitBeforeMarketClose;
  updateField: (field: string, value: any) => void;
}

const MarketCloseExitForm: React.FC<MarketCloseExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <EnhancedNumberInput
      label="Minutes Before Close"
      id="minutes-before-close"
      value={exitCondition.minutesBefore}
      onChange={(value) => updateField('minutesBefore', value)}
      min={1}
      description="Exit this many minutes before market close"
    />
  );
};

export default MarketCloseExitForm;
