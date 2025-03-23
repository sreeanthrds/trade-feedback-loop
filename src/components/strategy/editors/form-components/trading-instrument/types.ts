
export interface TradingInstrumentData {
  tradingType: 'stock' | 'futures' | 'options' | '';
  underlying?: 'index' | 'indexFuture' | 'stock' | '';
  symbol?: string;
}

export interface InstrumentSymbol {
  symbol: string;
  name: string;
}
