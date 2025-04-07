
import React from 'react';
import { BacktestResults } from '@/components/strategy/backtesting/types';
import PerformanceMetrics from './PerformanceMetrics';
import MonthlyReturnsChart from './MonthlyReturnsChart';

interface ReportsGridProps {
  results: BacktestResults;
}

const ReportsGrid = ({ results }: ReportsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PerformanceMetrics results={results} />
      <MonthlyReturnsChart />
    </div>
  );
};

export default ReportsGrid;
