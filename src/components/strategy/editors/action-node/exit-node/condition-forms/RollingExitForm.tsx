
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
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
      <EnhancedNumberInput
        label="Days Before Expiry"
        id="days-before-expiry"
        value={exitCondition.daysBeforeExpiry}
        onChange={(value) => updateField('daysBeforeExpiry', value)}
        min={1}
        description="Roll position this many days before expiry"
      />
      
      <EnhancedNumberInput
        label="Strike Difference"
        id="strike-difference"
        value={exitCondition.strikeDifference}
        onChange={(value) => updateField('strikeDifference', value)}
        description="Difference in strike price points (+/-)"
      />
    </div>
  );
};

export default RollingExitForm;
