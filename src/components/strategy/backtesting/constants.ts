
import { BacktestingConfig } from './types';

export const defaultConfig: BacktestingConfig = {
  enabled: false, // Set to false to prevent auto-running
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
  endDate: new Date(),
  initialCapital: 10000,
  slippagePercentage: 0.1,
  commissionPercentage: 0.05,
  riskPerTrade: 2,
  timeframe: '1d',
  maxOpenPositions: 5,
  enableOptimization: false
};
