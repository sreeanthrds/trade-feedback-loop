
export interface BacktestingConfig {
  enabled: boolean;
  startDate: Date | null;
  endDate: Date | null;
  initialCapital: number;
  slippagePercentage: number;
  commissionPercentage: number;
  riskPerTrade: number;
  timeframe: string;
  maxOpenPositions: number;
  enableOptimization: boolean;
}

export interface BacktestResult {
  totalReturn: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  tradesCount: number;
  profitFactor: number;
  equityCurve: {
    timestamp: number;
    equity: number;
  }[];
}
