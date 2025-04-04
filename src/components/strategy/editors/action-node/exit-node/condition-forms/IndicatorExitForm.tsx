
import React from 'react';
import SelectField from '../../../shared/SelectField';
import InputField from '../../../shared/InputField';
import { ExitByIndicator } from '../types';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import { Label } from '@/components/ui/label';

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
        id="indicator-type"
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
        id="indicator-condition"
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
        id="indicator-value"
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
        description="Target indicator value"
      />
      
      <div className="space-y-1">
        <Label htmlFor="offset" className="text-sm font-medium">Look back</Label>
        <div className="w-full flex items-center gap-2">
          <EnhancedNumberInput
            id="offset"
            value={exitCondition.offset !== undefined ? Math.abs(exitCondition.offset) : 0}
            onChange={(value) => updateField('offset', value !== undefined ? -Math.abs(value) : 0)}
            min={0}
            max={20}
            step={1}
            placeholder="0"
          />
          <span className="text-sm text-muted-foreground">candles ago</span>
        </div>
      </div>
    </div>
  );
};

export default IndicatorExitForm;
