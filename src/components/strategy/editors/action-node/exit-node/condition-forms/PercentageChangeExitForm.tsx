
import React from 'react';
import InputField from '../../../shared/InputField';
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
      <InputField
        label="Percentage"
        type="number"
        value={exitCondition.percentage === undefined ? '' : exitCondition.percentage}
        onChange={(e) => {
          // Handle empty input
          if (e.target.value === '') {
            updateField('percentage', undefined);
            return;
          }
          updateField('percentage', parseFloat(e.target.value))
        }}
        description={`Target percentage change in ${exitCondition.type === 'premium_change' ? 'premium' : 'position value'}`}
      />
      
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
