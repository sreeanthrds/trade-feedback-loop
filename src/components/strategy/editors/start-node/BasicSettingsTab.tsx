
import React from 'react';
import { 
  InputField, 
  SelectField, 
  RadioGroupField 
} from '../shared';
import SymbolSelector from '../form-components/SymbolSelector';
import { timeframeOptions, exchangeOptions } from '../../utils/indicatorConfig';

interface BasicSettingsTabProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  handleTradingInstrumentChange: (type: 'stock' | 'futures' | 'options') => void;
  handleUnderlyingTypeChange: (underlyingType: 'index' | 'indexFuture' | 'stock') => void;
}

const BasicSettingsTab: React.FC<BasicSettingsTabProps> = ({
  formData,
  handleInputChange,
  handleTradingInstrumentChange,
  handleUnderlyingTypeChange
}) => {
  // Define radio options for instrument type
  const instrumentTypeOptions = [
    { value: 'stock', label: 'Stock' },
    { value: 'futures', label: 'Futures' },
    { value: 'options', label: 'Options' }
  ];
  
  // Define radio options for underlying type
  const underlyingTypeOptions = [
    { value: 'index', label: 'Index' },
    { value: 'indexFuture', label: 'Index Future' },
    { value: 'stock', label: 'Stock' }
  ];

  return (
    <div className="space-y-4">
      <InputField
        label="Strategy Name"
        id="node-label"
        value={formData.label || ''}
        onChange={(e) => handleInputChange('label', e.target.value)}
        placeholder="Enter strategy name"
      />
      
      <RadioGroupField
        label="Trading Instrument Type" 
        value={formData.tradingInstrument?.type || 'stock'}
        options={instrumentTypeOptions}
        onChange={(value) => handleTradingInstrumentChange(value as 'stock' | 'futures' | 'options')}
      />
      
      {formData.tradingInstrument?.type === 'options' && (
        <RadioGroupField
          label="Underlying Type" 
          value={formData.tradingInstrument.underlyingType || ''}
          options={underlyingTypeOptions}
          onChange={(value) => handleUnderlyingTypeChange(value as 'index' | 'indexFuture' | 'stock')}
        />
      )}
      
      <SelectField
        label="Timeframe"
        id="node-timeframe"
        value={formData.timeframe || ''}
        options={timeframeOptions}
        onChange={(value) => handleInputChange('timeframe', value)}
        placeholder="Select timeframe"
      />
      
      <SelectField
        label="Exchange"
        id="node-exchange"
        value={formData.exchange || ''}
        options={exchangeOptions}
        onChange={(value) => handleInputChange('exchange', value)}
        placeholder="Select exchange"
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="node-symbol">Symbol</label>
        <SymbolSelector
          id="node-symbol"
          value={formData.symbol || ''}
          onChange={(value) => handleInputChange('symbol', value)}
          placeholder="Search for a symbol..."
          instrumentType={formData.tradingInstrument?.type}
          underlyingType={formData.tradingInstrument?.type === 'options' ? formData.tradingInstrument.underlyingType : undefined}
        />
      </div>
    </div>
  );
};

export default BasicSettingsTab;
