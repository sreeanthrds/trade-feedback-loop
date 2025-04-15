
import { v4 as uuidv4 } from 'uuid';
import { Transaction, MarketRegimeAnalysis } from '../types';

// Helper to generate mock transactions
export const generateMockTransactions = (): Transaction[] => {
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
  const now = Date.now();
  const transactions: Transaction[] = [];
  
  // Generate 42 trades (entry + exit pairs)
  for (let i = 0; i < 21; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const timestamp = now - (Math.random() * 180 * 86400000);
    const entryPrice = Math.random() * 200 + 50;
    const quantity = Math.floor(Math.random() * 100) + 10;
    const entryAmount = entryPrice * quantity;
    const entryFees = entryAmount * 0.001;
    
    // Entry transaction
    transactions.push({
      id: uuidv4(),
      timestamp,
      type: 'entry',
      symbol,
      price: entryPrice,
      quantity,
      side: 'buy',
      amount: entryAmount,
      fees: entryFees
    });
    
    // Exit transaction (1-5 days later)
    const exitTimestamp = timestamp + (Math.random() * 5 * 86400000);
    const isProfitable = Math.random() > 0.35; // 65% win rate
    const pnlPercentage = isProfitable 
      ? Math.random() * 5 + 0.5 // 0.5% to 5.5% profit
      : -(Math.random() * 3 + 0.2); // 0.2% to 3.2% loss
    
    const exitPrice = entryPrice * (1 + pnlPercentage / 100);
    const exitAmount = exitPrice * quantity;
    const exitFees = exitAmount * 0.001;
    const pnl = exitAmount - entryAmount - entryFees - exitFees;
    
    const exitReasons = ['take_profit', 'stop_loss', 'trailing_stop', 'manual', 'strategy_end'];
    const exitReason = isProfitable 
      ? (Math.random() > 0.7 ? 'take_profit' : 'trailing_stop') 
      : (Math.random() > 0.7 ? 'stop_loss' : 'manual');
    
    transactions.push({
      id: uuidv4(),
      timestamp: exitTimestamp,
      type: 'exit',
      symbol,
      price: exitPrice,
      quantity,
      side: 'sell',
      amount: exitAmount,
      fees: exitFees,
      pnl,
      pnlPercentage,
      exitReason: exitReason as any
    });
  }
  
  // Sort by timestamp
  return transactions.sort((a, b) => a.timestamp - b.timestamp);
};

// Generate monthly returns based on transactions
export const generateMonthlyReturns = (transactions: Transaction[]): { month: string; return: number }[] => {
  const monthlyMap = new Map<string, number>();
  
  // Only use exit transactions for PnL
  const exitTransactions = transactions.filter(t => t.type === 'exit' && t.pnl !== undefined);
  
  exitTransactions.forEach(transaction => {
    const date = new Date(transaction.timestamp);
    const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    const currentTotal = monthlyMap.get(monthKey) || 0;
    monthlyMap.set(monthKey, currentTotal + (transaction.pnl || 0));
  });
  
  // Convert to percentage returns (assume 10000 starting capital for simplicity)
  const monthlyReturns = Array.from(monthlyMap.entries()).map(([month, pnl]) => ({
    month,
    return: (pnl / 10000) * 100
  }));
  
  return monthlyReturns;
};

// Generate mock market regime analysis data
export const generateMarketConditionAnalysis = (): MarketRegimeAnalysis => {
  return {
    regimes: {
      'bull': {
        return: 12.5,
        winRate: 70.2,
        trades: 28,
        sharpeRatio: 1.9,
        maxDrawdown: 5.7,
        avgDuration: 14.3
      },
      'bear': {
        return: -4.3,
        winRate: 45.8,
        trades: 12,
        sharpeRatio: 0.7,
        maxDrawdown: 12.8,
        avgDuration: 8.6
      },
      'sideways': {
        return: 5.1,
        winRate: 58.3,
        trades: 12,
        sharpeRatio: 1.2,
        maxDrawdown: 6.2,
        avgDuration: 10.5
      },
      'high_volatility': {
        return: 7.8,
        winRate: 61.5,
        trades: 13,
        sharpeRatio: 1.4,
        maxDrawdown: 9.3,
        avgDuration: 7.2
      },
      'low_volatility': {
        return: 4.2,
        winRate: 64.7,
        trades: 17,
        sharpeRatio: 1.3,
        maxDrawdown: 4.1,
        avgDuration: 12.8
      }
    },
    volatility: {
      'very_low': {
        return: 3.5,
        winRate: 62.0,
        sharpeRatio: 1.2,
        maxDrawdown: 3.8
      },
      'low': {
        return: 5.2,
        winRate: 65.0,
        sharpeRatio: 1.4,
        maxDrawdown: 4.5
      },
      'medium': {
        return: 8.3,
        winRate: 63.2,
        sharpeRatio: 1.5,
        maxDrawdown: 6.2
      },
      'high': {
        return: 12.6,
        winRate: 59.5,
        sharpeRatio: 1.6,
        maxDrawdown: 9.8
      },
      'very_high': {
        return: 15.8,
        winRate: 54.0,
        sharpeRatio: 1.3,
        maxDrawdown: 14.5
      }
    },
    sectorPerformance: {
      'Technology': {
        return: 14.2,
        winRate: 68.5,
        allocation: 30.0
      },
      'Healthcare': {
        return: 8.5,
        winRate: 62.3,
        allocation: 15.0
      },
      'Consumer': {
        return: 6.7,
        winRate: 59.8,
        allocation: 20.0
      },
      'Financial': {
        return: 9.1,
        winRate: 61.2,
        allocation: 18.0
      },
      'Energy': {
        return: 4.5,
        winRate: 52.8,
        allocation: 10.0
      },
      'Utilities': {
        return: 3.2,
        winRate: 58.7,
        allocation: 7.0
      }
    },
    correlations: {
      'S&P 500': 0.72,
      'NASDAQ': 0.85,
      'Russell 2000': 0.65,
      'VIX': -0.58,
      '10Y Treasury': -0.32
    }
  };
};
