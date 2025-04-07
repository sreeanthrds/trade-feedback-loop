
import React from 'react';
import { BacktestResult } from '@/components/strategy/backtesting/types';
import PerformanceMetrics from './PerformanceMetrics';
import MonthlyReturnsChart from './MonthlyReturnsChart';

interface ReportsGridProps {
  results: BacktestResult;
}

const ReportsGrid = ({ results }: ReportsGridProps) => {
  // Generate monthly returns mock data (since BacktestResult doesn't have monthlyReturns)
  const mockMonthlyReturns = Array.from({ length: 6 }, (_, i) => ({
    month: new Date(Date.now() - (5-i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
    return: (Math.random() * 10 - 2)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PerformanceMetrics results={results} />
      <MonthlyReturnsChart monthlyReturns={mockMonthlyReturns} />
    </div>
  );
};

export default ReportsGrid;
