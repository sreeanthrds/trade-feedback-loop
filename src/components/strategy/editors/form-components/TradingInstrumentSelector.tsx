
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

  // Simulate loading when trading type or underlying changes
  useEffect(() => {
    if (value.tradingType === '' || 
        (value.tradingType === 'options' && !value.underlying)) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API request delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [value.tradingType, value.underlying]);

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
      ...value,
      underlying,
      symbol: undefined, // Reset symbol when underlying changes
      isLoading: true
    });
  };

  const handleSymbolChange = (symbol: string) => {
    onChange({
      ...value,
      symbol,
      isLoading: false
    });
  };

  // Get the appropriate symbols list based on current selection
  const symbolsList = getSymbolList(value) || [];

  return (
    <div className="space-y-4">
      <TradingTypeSelector 
        value={value.tradingType} 
        onChange={handleTradingTypeChange} 
      />

      {/* Show underlying selection only for Options */}
      {value.tradingType === 'options' && (
        <UnderlyingTypeSelector 
          value={value.underlying || ''} 
          onChange={handleUnderlyingChange} 
        />
      )}

      {/* Show symbol selection when appropriate */}
      {((value.tradingType === 'stock' || value.tradingType === 'futures') || 
        (value.tradingType === 'options' && value.underlying)) && (
          <SymbolSelector 
            value={value.symbol} 
            symbols={symbolsList}
            onChange={handleSymbolChange}
            isLoading={isLoading}
          />
      )}
    </div>
  );
};

export default TradingInstrumentSelector;
