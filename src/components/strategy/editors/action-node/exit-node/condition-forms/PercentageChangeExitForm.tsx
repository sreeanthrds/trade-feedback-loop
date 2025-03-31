
import React from 'react';
import { Label } from '@/components/ui/label';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import RadioGroupField from '../../../shared/RadioGroupField';
import { ExitByPercentage } from '../types';

interface PercentageChangeExitFormProps {
  exitCondition: ExitByPercentage;
  updateField: (field: string, value: any) => void;
}

const PercentageChangeExitForm: React.FC<PercentageChangeExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="percentage-change" className="flex items-center">
          Percentage
        </Label>
        <EnhancedNumberInput
          id="percentage-change"
          value={exitCondition.percentage}
          onChange={(value) => updateField('percentage', value)}
          description={`Target percentage change in ${exitCondition.type === 'premium_change' ? 'premium' : 'position value'}`}
        />
      </div>
      
      <RadioGroupField
        label="Direction"
        value={exitCondition.direction || 'increase'}
        onChange={(value) => updateField('direction', value)}
        options={[
          { value: 'increase', label: 'Increase' },
          { value: 'decrease', label: 'Decrease' }
        ]}
        layout="horizontal"
      />
    </div>
  );
};

export default PercentageChangeExitForm;
