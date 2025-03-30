
import React from 'react';
import InputField from '../../../shared/InputField';
import RadioGroupField from '../../../shared/RadioGroupField';
import { ExitByPriceTarget } from '../types';

interface PriceTargetExitFormProps {
  exitCondition: ExitByPriceTarget;
  updateField: (field: string, value: any) => void;
}

const PriceTargetExitForm: React.FC<PriceTargetExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Target Price"
        type="number"
        value={exitCondition.price === undefined ? '' : exitCondition.price}
        onChange={(e) => {
          // Handle empty input
          if (e.target.value === '') {
            updateField('price', undefined);
            return;
          }
          updateField('price', parseFloat(e.target.value))
        }}
        description="Target price level"
      />
      
      <RadioGroupField
        label="Direction"
        value={exitCondition.direction || 'above'}
        onChange={(value) => updateField('direction', value)}
        options={[
          { value: 'above', label: 'Price Above Target' },
          { value: 'below', label: 'Price Below Target' }
        ]}
        layout="horizontal"
      />
    </div>
  );
};

export default PriceTargetExitForm;
