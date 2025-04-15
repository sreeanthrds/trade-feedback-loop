
import { BacktestingConfig, BacktestResult } from '../types';

export interface BacktestingStore {
  config: BacktestingConfig;
  results: BacktestResult | null;
  isRunning: boolean;
  updateConfig: (updates: Partial<BacktestingConfig>) => void;
  startBacktest: () => void;
  stopBacktest: () => void;
  resetResults: () => void;
}
