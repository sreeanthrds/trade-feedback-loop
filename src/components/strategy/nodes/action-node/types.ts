
export interface ActionNodeData {
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
    strikeType?: 'ATM' | 'ITM1' | 'ITM2' | 'ITM3' | 'ITM4' | 'ITM5' | 'ITM6' | 'ITM7' | 'ITM8' | 'ITM9' | 'ITM10' | 'ITM11' | 'ITM12' | 'ITM13' | 'ITM14' | 'ITM15' | 'OTM1' | 'OTM2' | 'OTM3' | 'OTM4' | 'OTM5' | 'OTM6' | 'OTM7' | 'OTM8' | 'OTM9' | 'OTM10' | 'OTM11' | 'OTM12' | 'OTM13' | 'OTM14' | 'OTM15' | 'premium';
    strikeValue?: number;
    optionType?: 'CE' | 'PE';
  };
  _lastUpdated?: number; // Timestamp for forcing updates
}

export interface StartNodeData {
  symbol?: string;
}
