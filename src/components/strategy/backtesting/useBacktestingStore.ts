
import { create } from 'zustand';
import { BacktestingConfig, BacktestResult } from './types';

interface BacktestingStore {
  config: BacktestingConfig;
  results: BacktestResult | null;
  isRunning: boolean;
  updateConfig: (updates: Partial<BacktestingConfig>) => void;
  startBacktest: () => void;
  stopBacktest: () => void;
  resetResults: () => void;
}

const defaultConfig: BacktestingConfig = {
  enabled: false, // Changed from true to false to prevent auto-running
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

export const useBacktestingStore = create<BacktestingStore>((set, get) => ({
  config: defaultConfig,
  results: null,
  isRunning: false,
  
  updateConfig: (updates) => {
    set((state) => ({
      config: {
        ...state.config,
        ...updates
      }
    }));
  },
  
  startBacktest: () => {
    set({ isRunning: true });
    
    // In a real implementation, this would trigger the actual backtesting process
    // For now, just simulate it with a timeout and mock results
    setTimeout(() => {
      if (get().isRunning) {
        set({
          isRunning: false,
          results: {
            totalReturn: 15.7,
            winRate: 65.2,
            sharpeRatio: 1.85,
            maxDrawdown: 8.3,
            tradesCount: 42,
            profitFactor: 2.1,
            equityCurve: Array.from({ length: 180 }, (_, i) => ({
              timestamp: Date.now() - (180 - i) * 86400000,
              equity: 10000 * (1 + 0.15 * (i / 180)) * (1 + Math.sin(i / 10) * 0.03)
            }))
          }
        });
      }
    }, 2000);
  },
  
  stopBacktest: () => {
    set({ isRunning: false });
  },
  
  resetResults: () => {
    set({ results: null });
  }
}));
