
export interface Position {
  id: string;
  vpi: string;
  vpt: string;
  priority: number;
  positionType: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  limitPrice?: number;
  lots: number;
  productType: 'intraday' | 'carryForward';
  optionDetails?: {
    expiry?: string;
    strikeType?: 'ATM' | 'ITM1' | 'ITM2' | 'ITM3' | 'OTM1' | 'OTM2' | 'OTM3' | 'premium';
    strikeValue?: number;
    optionType?: 'CE' | 'PE';
  };
}

export interface ActionNodeData {
  label?: string;
  actionType?: 'entry' | 'exit' | 'alert';
  positions?: Position[];
  requiresSymbol?: boolean;
  symbol?: string;
  instrument?: string;
  _lastUpdated?: number;
  updateNodeData?: (id: string, data: Partial<ActionNodeData>) => void;
}
