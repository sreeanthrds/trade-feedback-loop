
import { TradingInstrumentData, InstrumentSymbol } from './types';
import { stocksList, indexList, indexFuturesList, fnoStocksList } from './mock-data';

export const getSymbolList = (instrumentData: TradingInstrumentData): InstrumentSymbol[] => {
  // Default to empty array for safety
  if (!instrumentData || !instrumentData.tradingType) {
    return [];
  }

  if (instrumentData.tradingType === 'stock') {
    return stocksList || [];
  } else if (instrumentData.tradingType === 'futures') {
    return indexFuturesList || [];
  } else if (instrumentData.tradingType === 'options') {
    switch (instrumentData.underlying) {
      case 'index':
        return indexList || [];
      case 'indexFuture':
        return indexFuturesList || [];
      case 'stock':
        return fnoStocksList || [];
      default:
        return [];
    }
  }
  return [];
};
