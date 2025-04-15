
import React from 'react';
import { Card } from '@/components/ui/card';
import { BacktestResult } from '@/components/strategy/backtesting/types';

interface PerformanceMetricsProps {
  results: BacktestResult;
}

const PerformanceMetrics = ({ results }: PerformanceMetricsProps) => {
  return (
    <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 gap-y-4">
          <div>
            <p className="text-gray-400 text-sm">Sharpe Ratio</p>
            <p className="text-lg font-medium text-white">{results.sharpeRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Profit Factor</p>
            <p className="text-lg font-medium text-white">{results.profitFactor.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Trades</p>
            <p className="text-lg font-medium text-white">{results.tradesCount}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Win/Loss Ratio</p>
            <p className="text-lg font-medium text-white">{(results.winRate / (100 - results.winRate)).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Avg. Holding Period</p>
            <p className="text-lg font-medium text-white">5.2 days</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Annualized Return</p>
            <p className="text-lg font-medium text-white">{(results.totalReturn * 365 / 180).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Recovery Factor</p>
            <p className="text-lg font-medium text-white">{(results.totalReturn / results.maxDrawdown).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Average Win</p>
            <p className="text-lg font-medium text-green-500">+2.34%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Average Loss</p>
            <p className="text-lg font-medium text-red-500">-1.12%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Risk-Adjusted Return</p>
            <p className="text-lg font-medium text-white">1.65</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceMetrics;
