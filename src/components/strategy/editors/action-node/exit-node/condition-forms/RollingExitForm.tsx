
import React from 'react';
import InputField from '../../../shared/InputField';
import { ExitWithRolling } from '../types';

interface RollingExitFormProps {
  exitCondition: ExitWithRolling;
  updateField: (field: string, value: any) => void;
}

const RollingExitForm: React.FC<RollingExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Days Before Expiry"
        id="days-before-expiry"
        type="number"
        value={exitCondition.daysBeforeExpiry === undefined ? '' : exitCondition.daysBeforeExpiry}
        onChange={(e) => {
          // Handle empty input
          if (e.target.value === '') {
            updateField('daysBeforeExpiry', undefined);
            return;
          }
          updateField('daysBeforeExpiry', parseInt(e.target.value))
        }}
        min={1}
        description="Roll position this many days before expiry"
      />
      
      <InputField
        label="Strike Difference"
        id="strike-difference"
        type="number"
        value={exitCondition.strikeDifference === undefined ? '' : exitCondition.strikeDifference}
        onChange={(e) => {
          // Handle empty input
          if (e.target.value === '') {
            updateField('strikeDifference', undefined);
            return;
          }
          updateField('strikeDifference', parseInt(e.target.value))
        }}
        description="Difference in strike price points (+/-)"
      />
    </div>
  );
};

export default RollingExitForm;
