
import React from 'react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
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
      <EnhancedNumberInput
        label="Target Price"
        id="target-price"
        value={exitCondition.price}
        onChange={(value) => updateField('price', value)}
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
