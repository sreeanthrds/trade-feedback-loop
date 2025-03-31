
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
  // Handle number value change with proper type checking
  const handleNumberChange = (field: string) => (value: number | undefined) => {
    updateField(field, value);
  };

  return (
    <div className="space-y-4">
      <EnhancedNumberInput
        label="Days Before Expiry"
        id="days-before-expiry"
        value={exitCondition.daysBeforeExpiry}
        onChange={handleNumberChange('daysBeforeExpiry')}
        min={1}
        description="Roll position this many days before expiry"
      />
      
      <EnhancedNumberInput
        label="Strike Difference"
        id="strike-difference"
        value={exitCondition.strikeDifference}
        onChange={handleNumberChange('strikeDifference')}
        description="Difference in strike price points (+/-)"
      />
    </div>
  );
};

export default RollingExitForm;
