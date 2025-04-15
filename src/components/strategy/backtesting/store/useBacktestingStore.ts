
import { create } from 'zustand';
import { defaultConfig } from '../constants';
import { BacktestingStore } from './types';
import { generateMockTransactions, generateMonthlyReturns } from '../utils/mockDataGenerators';

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
        const mockTransactions = generateMockTransactions();
        const monthlyReturns = generateMonthlyReturns(mockTransactions);
        
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
            })),
            transactions: mockTransactions,
            monthlyReturns
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
