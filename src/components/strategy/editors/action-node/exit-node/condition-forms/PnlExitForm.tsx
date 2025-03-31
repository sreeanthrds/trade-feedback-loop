
import React from 'react';
import { Label } from '@/components/ui/label';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import RadioGroupField from '../../../shared/RadioGroupField';
import { ExitByPnL } from '../types';

interface PnlExitFormProps {
  exitCondition: ExitByPnL;
  updateField: (field: string, value: any) => void;
}

const PnlExitForm: React.FC<PnlExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pnl-value" className="flex items-center">
          P&L Value
        </Label>
        <EnhancedNumberInput
          id="pnl-value"
          value={exitCondition.value}
          onChange={(value) => updateField('value', value)}
          description={`Target ${exitCondition.type === 'realized_pnl' ? 'realized' : 'unrealized'} P&L value`}
        />
      </div>
      
      <RadioGroupField
        label="Direction"
        value={exitCondition.direction || 'above'}
        onChange={(value) => updateField('direction', value)}
        options={[
          { value: 'above', label: 'Above Value' },
          { value: 'below', label: 'Below Value' }
        ]}
        layout="horizontal"
      />
    </div>
  );
};

export default PnlExitForm;
