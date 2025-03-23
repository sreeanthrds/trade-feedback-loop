
import { TradingInstrumentData, InstrumentSymbol } from './types';
import { stocksList, indexList, indexFuturesList, fnoStocksList } from './mock-data';

export const getSymbolList = (instrumentData: TradingInstrumentData): InstrumentSymbol[] => {
  // Default to empty array for safety
  if (!instrumentData || !instrumentData.tradingType) {
    return [];
  }

  // Make sure our mock data lists are arrays
  const stocks = Array.isArray(stocksList) ? stocksList : [];
  const indices = Array.isArray(indexList) ? indexList : [];
  const indexFutures = Array.isArray(indexFuturesList) ? indexFuturesList : [];
  const fnoStocks = Array.isArray(fnoStocksList) ? fnoStocksList : [];

  if (instrumentData.tradingType === 'stock') {
    return stocks;
  } else if (instrumentData.tradingType === 'futures') {
    return indexFutures;
  } else if (instrumentData.tradingType === 'options') {
    switch (instrumentData.underlying) {
      case 'index':
        return indices;
      case 'indexFuture':
        return indexFutures;
      case 'stock':
        return fnoStocks;
      default:
        return [];
    }
  }
  return [];
};
