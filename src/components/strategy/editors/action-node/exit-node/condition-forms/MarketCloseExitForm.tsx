
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
      id="minutes-before-close"
      type="number"
      value={exitCondition.minutesBefore === undefined ? '' : exitCondition.minutesBefore}
      onChange={(e) => {
        // Handle empty input
        if (e.target.value === '') {
          updateField('minutesBefore', undefined);
          return;
        }
        updateField('minutesBefore', parseInt(e.target.value))
      }}
      min={1}
      description="Exit this many minutes before market close"
    />
  );
};

export default MarketCloseExitForm;
