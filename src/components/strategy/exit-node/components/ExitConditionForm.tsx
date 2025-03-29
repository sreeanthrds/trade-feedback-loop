
import React from 'react';
import { ExitCondition, ExitConditionType } from '../types';
import { InputField, SelectField, RadioGroupField } from '../../editors/shared';

interface ExitConditionFormProps {
  exitCondition: ExitCondition;
  updateField: (field: string, value: any) => void;
}

const ExitConditionForm: React.FC<ExitConditionFormProps> = ({ 
  exitCondition,
  updateField
}) => {
  // Determine which form to render based on exitCondition type
  const renderConditionForm = () => {
    switch (exitCondition.type) {
      case 'vpi':
      case 'vpt':
        return (
          <InputField
            label={exitCondition.type === 'vpi' ? 'Virtual Position ID' : 'Virtual Position Tag'}
            value={exitCondition.identifier || ''}
            onChange={(e) => updateField('identifier', e.target.value)}
            placeholder={`Enter ${exitCondition.type === 'vpi' ? 'VPI' : 'VPT'}`}
          />
        );
      
      case 'realized_pnl':
      case 'unrealized_pnl':
        const pnlCondition = exitCondition as any;
        return (
          <div className="space-y-4">
            <InputField
              label="P&L Value (₹)"
              type="number"
              value={pnlCondition.value || 0}
              onChange={(e) => updateField('value', parseFloat(e.target.value))}
              min={0}
            />
            <RadioGroupField
              label="Exit When P&L is"
              value={pnlCondition.direction || 'above'}
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
        const percentageCondition = exitCondition as any;
        return (
          <div className="space-y-4">
            <InputField
              label="Percentage Change (%)"
              type="number"
              value={percentageCondition.percentage || 0}
              onChange={(e) => updateField('percentage', parseFloat(e.target.value))}
              min={0}
            />
            <RadioGroupField
              label="Exit When Value"
              value={percentageCondition.direction || 'increase'}
              onChange={(value) => updateField('direction', value)}
              options={[
                { value: 'increase', label: 'Increases By' },
                { value: 'decrease', label: 'Decreases By' }
              ]}
              layout="horizontal"
            />
          </div>
        );
      
      case 'price_target':
        const priceCondition = exitCondition as any;
        return (
          <div className="space-y-4">
            <InputField
              label="Target Price (₹)"
              type="number"
              value={priceCondition.price || 0}
              onChange={(e) => updateField('price', parseFloat(e.target.value))}
              min={0}
            />
            <RadioGroupField
              label="Exit When Price is"
              value={priceCondition.direction || 'above'}
              onChange={(value) => updateField('direction', value)}
              options={[
                { value: 'above', label: 'Above Target' },
                { value: 'below', label: 'Below Target' }
              ]}
              layout="horizontal"
            />
          </div>
        );
      
      case 'indicator_underlying':
      case 'indicator_contract':
        const indicatorCondition = exitCondition as any;
        return (
          <div className="space-y-4">
            <SelectField
              label="Indicator"
              value={indicatorCondition.indicator || 'RSI'}
              onChange={(value) => updateField('indicator', value)}
              options={[
                { value: 'RSI', label: 'RSI' },
                { value: 'MACD', label: 'MACD' },
                { value: 'EMA', label: 'EMA' },
                { value: 'SMA', label: 'SMA' },
                { value: 'Stochastic', label: 'Stochastic' },
                { value: 'Bollinger', label: 'Bollinger Bands' }
              ]}
            />
            <SelectField
              label="Condition"
              value={indicatorCondition.condition || 'above'}
              onChange={(value) => updateField('condition', value)}
              options={[
                { value: 'above', label: 'Above' },
                { value: 'below', label: 'Below' },
                { value: 'crosses_above', label: 'Crosses Above' },
                { value: 'crosses_below', label: 'Crosses Below' }
              ]}
            />
            <InputField
              label="Value"
              type="number"
              value={indicatorCondition.value || 0}
              onChange={(e) => updateField('value', parseFloat(e.target.value))}
            />
          </div>
        );
      
      case 'time_based':
        const timeCondition = exitCondition as any;
        return (
          <InputField
            label="Minutes After Entry"
            type="number"
            value={timeCondition.minutes || 30}
            onChange={(e) => updateField('minutes', parseInt(e.target.value, 10))}
            min={1}
          />
        );
      
      case 'market_close':
        const marketCloseCondition = exitCondition as any;
        return (
          <InputField
            label="Minutes Before Market Close"
            type="number"
            value={marketCloseCondition.minutesBefore || 15}
            onChange={(e) => updateField('minutesBefore', parseInt(e.target.value, 10))}
            min={1}
          />
        );
      
      case 'limit_to_market':
        const fallbackCondition = exitCondition as any;
        return (
          <InputField
            label="Seconds to Wait Before Converting to Market Order"
            type="number"
            value={fallbackCondition.waitSeconds || 60}
            onChange={(e) => updateField('waitSeconds', parseInt(e.target.value, 10))}
            min={1}
          />
        );
      
      case 'rolling':
        const rollingCondition = exitCondition as any;
        return (
          <div className="space-y-4">
            <InputField
              label="Days Before Expiry"
              type="number"
              value={rollingCondition.daysBeforeExpiry || 2}
              onChange={(e) => updateField('daysBeforeExpiry', parseInt(e.target.value, 10))}
              min={1}
            />
            <InputField
              label="Strike Difference (optional)"
              type="number"
              value={rollingCondition.strikeDifference || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                updateField('strikeDifference', value);
              }}
            />
          </div>
        );
      
      default:
        return (
          <div className="text-center text-sm text-muted-foreground py-4">
            No additional settings required for this exit condition
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      {renderConditionForm()}
    </div>
  );
};

export default ExitConditionForm;
