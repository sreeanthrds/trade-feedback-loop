
import { InstrumentSymbol } from './types';

// Sample data - these would be replaced with actual API data in production
export const stocksList: InstrumentSymbol[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
  { symbol: 'INFY', name: 'Infosys Ltd' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
  { symbol: 'WIPRO', name: 'Wipro Ltd' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd' },
  { symbol: 'ITC', name: 'ITC Ltd' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd' },
];

export const indexList: InstrumentSymbol[] = [
  { symbol: 'NIFTY', name: 'Nifty 50' },
  { symbol: 'BANKNIFTY', name: 'Bank Nifty' },
  { symbol: 'FINNIFTY', name: 'Financial Services Nifty' },
  { symbol: 'MIDCPNIFTY', name: 'Nifty Midcap Select' },
];

export const indexFuturesList: InstrumentSymbol[] = [
  { symbol: 'NIFTYFUT', name: 'Nifty 50 Futures' },
  { symbol: 'BANKNIFTYFUT', name: 'Bank Nifty Futures' },
  { symbol: 'FINNIFTYFUT', name: 'Financial Services Nifty Futures' },
  { symbol: 'MIDCPNIFTYFUT', name: 'Nifty Midcap Select Futures' },
];

// For demo, assume only some stocks have F&O
export const fnoStocksList: InstrumentSymbol[] = stocksList.slice(0, 7);
