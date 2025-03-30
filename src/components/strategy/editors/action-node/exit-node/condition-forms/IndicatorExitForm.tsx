
import React from 'react';
import SelectField from '../../../shared/SelectField';
import InputField from '../../../shared/InputField';
import { ExitByIndicator } from '../types';

interface IndicatorExitFormProps {
  exitCondition: ExitByIndicator;
  updateField: (field: string, value: any) => void;
}

const IndicatorExitForm: React.FC<IndicatorExitFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  return (
    <div className="space-y-4">
      <SelectField
        label="Indicator"
        value={exitCondition.indicator || 'RSI'}
        onChange={(value) => updateField('indicator', value)}
        options={[
          { value: 'RSI', label: 'RSI' },
          { value: 'MACD', label: 'MACD' },
          { value: 'Bollinger', label: 'Bollinger Bands' },
          { value: 'ATR', label: 'ATR' },
          { value: 'IV', label: 'Implied Volatility' }
        ]}
        description={`Indicator on ${exitCondition.type === 'indicator_underlying' ? 'underlying asset' : 'contract'}`}
      />
      
      <SelectField
        label="Condition"
        value={exitCondition.condition || 'above'}
        onChange={(value) => updateField('condition', value)}
        options={[
          { value: 'above', label: 'Above' },
          { value: 'below', label: 'Below' },
          { value: 'crossover', label: 'Crossover' },
          { value: 'crossunder', label: 'Crossunder' }
        ]}
      />
      
      <InputField
        label="Value"
        type="number"
        value={exitCondition.value || 0}
        onChange={(e) => updateField('value', parseFloat(e.target.value))}
        description="Target indicator value"
      />
    </div>
  );
};

export default IndicatorExitForm;
