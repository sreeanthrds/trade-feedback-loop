
export interface NodeData {
  label?: string;
  actionType?: 'entry' | 'exit' | 'alert';
  positionType?: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  limitPrice?: number;
  lots?: number;
  productType?: 'intraday' | 'carryForward';
  instrument?: string;
  optionDetails?: {
    expiry?: string;
    strikeType?: 'ATM' | 'ITM' | 'OTM' | 'premium';
    strikeValue?: number;
    optionType?: 'CE' | 'PE';
  };
}

export interface StartNodeData {
  tradingInstrument?: {
    type?: 'options' | 'futures' | 'stock' | 'index';
  };
  symbol?: string;
}
