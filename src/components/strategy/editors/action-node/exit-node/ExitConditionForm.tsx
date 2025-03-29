
import React from 'react';
import { ExitCondition } from './types';
import InputField from '../../shared/InputField';
import SelectField from '../../shared/SelectField';
import RadioGroupField from '../../shared/RadioGroupField';

interface ExitConditionFormProps {
  exitCondition: ExitCondition;
  updateField: (field: string, value: any) => void;
}

const ExitConditionForm: React.FC<ExitConditionFormProps> = ({ 
  exitCondition, 
  updateField 
}) => {
  // Render different form fields based on exit condition type
  switch (exitCondition.type) {
    case 'vpi':
    case 'vpt':
      return (
        <InputField
          label={exitCondition.type === 'vpi' ? 'Virtual Position ID' : 'Virtual Position Tag'}
          value={(exitCondition as any).identifier || ''}
          onChange={(e) => updateField('identifier', e.target.value)}
          description={`Enter the ${exitCondition.type === 'vpi' ? 'VPI' : 'VPT'} to exit`}
        />
      );
      
    case 'all_positions':
      return (
        <div className="p-4 bg-muted/20 rounded-md text-sm text-muted-foreground">
          This will exit all currently open positions in the strategy.
        </div>
      );
      
    case 'realized_pnl':
    case 'unrealized_pnl':
      return (
        <div className="space-y-4">
          <InputField
            label="P&L Value"
            type="number"
            value={(exitCondition as any).value || 0}
            onChange={(e) => updateField('value', parseFloat(e.target.value))}
            description={`Target ${exitCondition.type === 'realized_pnl' ? 'realized' : 'unrealized'} P&L value`}
          />
          
          <RadioGroupField
            label="Direction"
            value={(exitCondition as any).direction || 'above'}
            onChange={(value) => updateField('direction', value)}
            options={[
              { value: 'above', label: 'Above Value' },
              { value: 'below', label: 'Below Value' }
            ]}
            layout="horizontal"
          />
        </div>
      );
      
    case 'premium_change':
    case 'position_value_change':
      return (
        <div className="space-y-4">
          <InputField
            label="Percentage"
            type="number"
            value={(exitCondition as any).percentage || 0}
            onChange={(e) => updateField('percentage', parseFloat(e.target.value))}
            description={`Target percentage change in ${exitCondition.type === 'premium_change' ? 'premium' : 'position value'}`}
          />
          
          <RadioGroupField
            label="Direction"
            value={(exitCondition as any).direction || 'increase'}
            onChange={(value) => updateField('direction', value)}
            options={[
              { value: 'increase', label: 'Increase' },
              { value: 'decrease', label: 'Decrease' }
            ]}
            layout="horizontal"
          />
        </div>
      );
      
    case 'price_target':
      return (
        <div className="space-y-4">
          <InputField
            label="Target Price"
            type="number"
            value={(exitCondition as any).price || 0}
            onChange={(e) => updateField('price', parseFloat(e.target.value))}
            description="Target price level"
          />
          
          <RadioGroupField
            label="Direction"
            value={(exitCondition as any).direction || 'above'}
            onChange={(value) => updateField('direction', value)}
            options={[
              { value: 'above', label: 'Price Above Target' },
              { value: 'below', label: 'Price Below Target' }
            ]}
            layout="horizontal"
          />
        </div>
      );
      
    case 'indicator_underlying':
    case 'indicator_contract':
      return (
        <div className="space-y-4">
          <SelectField
            label="Indicator"
            value={(exitCondition as any).indicator || 'RSI'}
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
            value={(exitCondition as any).condition || 'above'}
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
            value={(exitCondition as any).value || 0}
            onChange={(e) => updateField('value', parseFloat(e.target.value))}
            description="Target indicator value"
          />
        </div>
      );
      
    case 'time_based':
      return (
        <InputField
          label="Minutes"
          type="number"
          value={(exitCondition as any).minutes || 30}
          onChange={(e) => updateField('minutes', parseInt(e.target.value))}
          min={1}
          description="Minutes after entry to exit position"
        />
      );
      
    case 'market_close':
      return (
        <InputField
          label="Minutes Before Close"
          type="number"
          value={(exitCondition as any).minutesBefore || 15}
          onChange={(e) => updateField('minutesBefore', parseInt(e.target.value))}
          min={1}
          description="Exit this many minutes before market close"
        />
      );
      
    case 'limit_to_market':
      return (
        <InputField
          label="Wait Seconds"
          type="number"
          value={(exitCondition as any).waitSeconds || 60}
          onChange={(e) => updateField('waitSeconds', parseInt(e.target.value))}
          min={1}
          description="Switch to market order after this many seconds"
        />
      );
      
    case 'rolling':
      return (
        <div className="space-y-4">
          <InputField
            label="Days Before Expiry"
            type="number"
            value={(exitCondition as any).daysBeforeExpiry || 2}
            onChange={(e) => updateField('daysBeforeExpiry', parseInt(e.target.value))}
            min={1}
            description="Roll position this many days before expiry"
          />
          
          <InputField
            label="Strike Difference"
            type="number"
            value={(exitCondition as any).strikeDifference || 0}
            onChange={(e) => updateField('strikeDifference', parseInt(e.target.value))}
            description="Difference in strike price points (+/-)"
          />
        </div>
      );
      
    default:
      return null;
  }
};

export default ExitConditionForm;
