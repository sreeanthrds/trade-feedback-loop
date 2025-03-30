
import React from 'react';
import InputField from '../../../shared/InputField';
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
    <InputField
      label="Minutes Before Close"
      type="number"
      value={exitCondition.minutesBefore || 15}
      onChange={(e) => updateField('minutesBefore', parseInt(e.target.value))}
      min={1}
      description="Exit this many minutes before market close"
    />
  );
};

export default MarketCloseExitForm;
