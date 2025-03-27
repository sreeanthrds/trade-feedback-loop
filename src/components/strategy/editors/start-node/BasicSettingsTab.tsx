
import React from 'react';
import { 
  InputField, 
  SelectField, 
  RadioGroupField 
} from '../shared';
import SymbolSelector from '../form-components/SymbolSelector';
import { timeframeOptions, exchangeOptions } from '../../utils/indicatorConfig';
import { useReactFlow } from '@xyflow/react';
import { findInstrumentUsages } from '../../utils/dependency-tracking/usageFinder';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

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
      />
      
      <RadioGroupField
        label="Trading Instrument Type" 
        value={formData.tradingInstrument?.type || 'stock'}
        options={instrumentTypeOptions}
        onChange={(value) => handleInstrumentTypeChangeWithCheck(value as 'stock' | 'futures' | 'options')}
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
          onChange={handleSymbolChange}
          placeholder="Search for a symbol..."
          instrumentType={formData.tradingInstrument?.type}
          underlyingType={formData.tradingInstrument?.type === 'options' ? formData.tradingInstrument.underlyingType : undefined}
        />
      </div>
      
      <AlertDialog open={isSymbolDialogOpen} onOpenChange={setIsSymbolDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isPendingInstrumentTypeChange 
                ? "Change Trading Instrument Type?" 
                : "Change Trading Symbol?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isPendingInstrumentTypeChange 
                ? `Changing instrument type to ${pendingInstrumentType} will reset the current symbol ${formData.symbol}` 
                : `The current symbol ${formData.symbol} is being used in:`}
              
              <ul className="mt-2 space-y-1 text-sm">
                {symbolUsages.map((usage, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span>{usage.nodeName} ({usage.context})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                {isPendingInstrumentTypeChange
                  ? "Changing the instrument type will affect all these nodes and reset the symbol. Do you want to continue?"
                  : "Changing the symbol will affect all these nodes. Do you want to continue?"}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChange}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BasicSettingsTab;
