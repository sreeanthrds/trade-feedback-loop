import React, { useState } from 'react';
import { 
  InputField, 
  SelectField, 
  RadioGroupField 
} from '../shared';
import SymbolSelector from '../form-components/SymbolSelector';
import { timeframeOptions, exchangeOptions } from '../../utils/indicatorConfig';
import { useReactFlow } from '@xyflow/react';
import { findInstrumentUsages } from '../../utils/dependency-tracking/usageFinder';
import SymbolChangeConfirmation from './components/SymbolChangeConfirmation';

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
  const { getNodes } = useReactFlow();
  const [isSymbolDialogOpen, setIsSymbolDialogOpen] = useState(false);
  const [isPendingInstrumentTypeChange, setIsPendingInstrumentTypeChange] = useState(false);
  const [pendingSymbol, setPendingSymbol] = useState<string>('');
  const [pendingInstrumentType, setPendingInstrumentType] = useState<'stock' | 'futures' | 'options'>('stock');
  const [symbolUsages, setSymbolUsages] = useState<any[]>([]);
  
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

  // Convert string array options to correct format
  const timeframeSelectOptions = timeframeOptions.map(option => ({ 
    value: option, 
    label: option 
  }));
    
  const exchangeSelectOptions = exchangeOptions.map(option => ({ 
    value: option, 
    label: option 
  }));

  const handleSymbolChange = (newSymbol: string) => {
    // If clearing the symbol or setting a new one when none exists
    if (!newSymbol || !formData.symbol) {
      handleInputChange('symbol', newSymbol);
      return;
    }
    
    // Check if the current symbol is used anywhere
    const usages = findInstrumentUsages(formData.symbol, getNodes());
    
    if (usages.length > 0) {
      // Show warning dialog
      setSymbolUsages(usages);
      setPendingSymbol(newSymbol);
      setIsPendingInstrumentTypeChange(false);
      setIsSymbolDialogOpen(true);
    } else {
      // No usages, safe to change
      handleInputChange('symbol', newSymbol);
    }
  };

  const handleInstrumentTypeChangeWithCheck = (type: 'stock' | 'futures' | 'options') => {
    // If there's no current symbol or we're not changing to a different type, proceed normally
    if (!formData.symbol || type === formData.tradingInstrument?.type) {
      handleTradingInstrumentChange(type);
      return;
    }
    
    // Check if the current symbol is used anywhere
    const usages = findInstrumentUsages(formData.symbol, getNodes());
    
    if (usages.length > 0) {
      // Show warning dialog
      setSymbolUsages(usages);
      setPendingInstrumentType(type);
      setIsPendingInstrumentTypeChange(true);
      setIsSymbolDialogOpen(true);
    } else {
      // No usages, safe to change
      handleTradingInstrumentChange(type);
    }
  };

  const confirmChange = () => {
    if (isPendingInstrumentTypeChange) {
      handleTradingInstrumentChange(pendingInstrumentType);
    } else {
      handleInputChange('symbol', pendingSymbol);
    }
    setIsSymbolDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <InputField
        label="Strategy Name"
        id="node-label"
        value={formData.label || ''}
        onChange={(e) => handleInputChange('label', e.target.value)}
        placeholder="Enter strategy name"
        required={true}
      />
      
      <RadioGroupField
        label="Trading Instrument Type" 
        value={formData.tradingInstrument?.type || 'stock'}
        options={instrumentTypeOptions}
        onChange={(value) => handleInstrumentTypeChangeWithCheck(value as 'stock' | 'futures' | 'options')}
        required={true}
      />
      
      {formData.tradingInstrument?.type === 'options' && (
        <RadioGroupField
          label="Underlying Type" 
          value={formData.tradingInstrument.underlyingType || ''}
          options={underlyingTypeOptions}
          onChange={(value) => handleUnderlyingTypeChange(value as 'index' | 'indexFuture' | 'stock')}
          required={true}
        />
      )}
      
      <SelectField
        label="Timeframe"
        id="node-timeframe"
        value={formData.timeframe || ''}
        options={timeframeSelectOptions}
        onChange={(value) => handleInputChange('timeframe', value)}
        placeholder="Select timeframe"
        required={true}
      />
      
      <SelectField
        label="Exchange"
        id="node-exchange"
        value={formData.exchange || ''}
        options={exchangeSelectOptions}
        onChange={(value) => handleInputChange('exchange', value)}
        placeholder="Select exchange"
        required={true}
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center" htmlFor="node-symbol">
          Symbol
          <span className="ml-1 text-red-500">*</span>
        </label>
        <SymbolSelector
          id="node-symbol"
          value={formData.symbol || ''}
          onChange={handleSymbolChange}
          placeholder="Search for a symbol..."
          instrumentType={formData.tradingInstrument?.type}
          underlyingType={formData.tradingInstrument?.type === 'options' ? formData.tradingInstrument.underlyingType : undefined}
          className={formData.symbol === '' ? "border-red-300 focus:ring-red-200" : ""}
        />
      </div>
      
      <SymbolChangeConfirmation
        isOpen={isSymbolDialogOpen}
        onOpenChange={setIsSymbolDialogOpen}
        isPendingInstrumentTypeChange={isPendingInstrumentTypeChange}
        pendingInstrumentType={pendingInstrumentType}
        currentSymbol={formData.symbol}
        symbolUsages={symbolUsages}
        onConfirm={confirmChange}
      />
    </div>
  );
};

export default BasicSettingsTab;
