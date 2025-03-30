
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
        type="number"
        value={exitCondition.daysBeforeExpiry || 2}
        onChange={(e) => updateField('daysBeforeExpiry', parseInt(e.target.value))}
        min={1}
        description="Roll position this many days before expiry"
      />
      
      <InputField
        label="Strike Difference"
        type="number"
        value={exitCondition.strikeDifference || 0}
        onChange={(e) => updateField('strikeDifference', parseInt(e.target.value))}
        description="Difference in strike price points (+/-)"
      />
    </div>
  );
};

export default RollingExitForm;
