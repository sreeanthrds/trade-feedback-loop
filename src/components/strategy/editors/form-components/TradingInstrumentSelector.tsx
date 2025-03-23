
import React, { useState, useEffect } from 'react';
import TradingTypeSelector from './trading-instrument/TradingTypeSelector';
import UnderlyingTypeSelector from './trading-instrument/UnderlyingTypeSelector';
import SymbolSelector from './trading-instrument/SymbolSelector';
import { TradingInstrumentData } from './trading-instrument/types';
import { getSymbolList } from './trading-instrument/utils';

interface TradingInstrumentSelectorProps {
  value: TradingInstrumentData;
  onChange: (value: TradingInstrumentData) => void;
}

const TradingInstrumentSelector: React.FC<TradingInstrumentSelectorProps> = ({
  value,
  onChange
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize value with default properties if not provided
  const safeValue: TradingInstrumentData = {
    tradingType: value?.tradingType || '',
    underlying: value?.underlying,
    symbol: value?.symbol,
    isLoading: value?.isLoading || false
  };

  // Simulate loading when trading type or underlying changes
  useEffect(() => {
    if (safeValue.tradingType === '' || 
        (safeValue.tradingType === 'options' && !safeValue.underlying)) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [safeValue.tradingType, safeValue.underlying]);

  const handleTradingTypeChange = (tradingType: 'stock' | 'futures' | 'options') => {
    // Reset relevant fields when trading type changes
    const newData: TradingInstrumentData = {
      tradingType,
      symbol: undefined,
      isLoading: true
    };
    
    // If options selected, set underlying but no symbol yet
    if (tradingType === 'options') {
      newData.underlying = '';
    } else {
      // For stock and futures, no underlying is needed
      newData.underlying = undefined;
    }
    
    onChange(newData);
  };

  const handleUnderlyingChange = (underlying: 'index' | 'indexFuture' | 'stock') => {
    onChange({
      ...safeValue,
      underlying,
      symbol: undefined, // Reset symbol when underlying changes
      isLoading: true
    });
  };

  const handleSymbolChange = (symbol: string) => {
    onChange({
      ...safeValue,
      symbol,
      isLoading: false
    });
  };

  // Get the appropriate symbols list based on current selection
  const symbolsList = getSymbolList(safeValue);

  return (
    <div className="space-y-4">
      <TradingTypeSelector 
        value={safeValue.tradingType} 
        onChange={handleTradingTypeChange} 
      />

      {/* Show underlying selection only for Options */}
      {safeValue.tradingType === 'options' && (
        <UnderlyingTypeSelector 
          value={safeValue.underlying || ''} 
          onChange={handleUnderlyingChange} 
        />
      )}

      {/* Show symbol selection when appropriate */}
      {((safeValue.tradingType === 'stock' || safeValue.tradingType === 'futures') || 
        (safeValue.tradingType === 'options' && safeValue.underlying)) && (
          <SymbolSelector 
            value={safeValue.symbol} 
            symbols={symbolsList}
            onChange={handleSymbolChange}
            isLoading={isLoading}
          />
      )}
    </div>
  );
};

export default TradingInstrumentSelector;
