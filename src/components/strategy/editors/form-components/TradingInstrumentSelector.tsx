
import React from 'react';
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
  const handleTradingTypeChange = (tradingType: 'stock' | 'futures' | 'options') => {
    // Reset relevant fields when trading type changes
    const newData: TradingInstrumentData = {
      tradingType,
      symbol: undefined
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
      symbol: undefined // Reset symbol when underlying changes
    });
  };

  const handleSymbolChange = (symbol: string) => {
    onChange({
      ...value,
      symbol
    });
  };

  // Get the appropriate symbols list based on current selection
  const symbolsList = getSymbolList(value);

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
        (value.tradingType === 'options' && value.underlying)) && 
        symbolsList.length > 0 && (
          <SymbolSelector 
            value={value.symbol} 
            symbols={symbolsList}
            onChange={handleSymbolChange} 
          />
      )}
    </div>
  );
};

export default TradingInstrumentSelector;
