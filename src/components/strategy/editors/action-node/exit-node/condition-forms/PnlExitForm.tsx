
import React from 'react';
import InputField from '../../../shared/InputField';
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
      <InputField
        label="P&L Value"
        id="pnl-value"
        type="number"
        value={exitCondition.value === undefined ? '' : exitCondition.value}
        onChange={(e) => {
          // Handle empty input
          if (e.target.value === '') {
            updateField('value', undefined);
            return;
          }
          updateField('value', parseFloat(e.target.value))
        }}
        description={`Target ${exitCondition.type === 'realized_pnl' ? 'realized' : 'unrealized'} P&L value`}
      />
      
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
