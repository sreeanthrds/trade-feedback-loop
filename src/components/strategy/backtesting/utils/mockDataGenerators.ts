
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../types';

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
