
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { TrendingUp, Award, TrendingDown, Activity } from 'lucide-react';

interface MetricsCardsProps {
  results: BacktestResult;
}

const MetricsCards = ({ results }: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="border border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>
            <CardDescription className="font-medium mb-1 text-gray-400">Total Return</CardDescription>
            <CardTitle className="text-2xl font-bold text-green-500">+{results.totalReturn.toFixed(2)}%</CardTitle>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </CardHeader>
      </Card>
      
      <Card className="border border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>
            <CardDescription className="font-medium mb-1 text-gray-400">Win Rate</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-500">{results.winRate.toFixed(1)}%</CardTitle>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Award className="h-6 w-6 text-blue-500" />
          </div>
        </CardHeader>
      </Card>
      
      <Card className="border border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>
            <CardDescription className="font-medium mb-1 text-gray-400">Max Drawdown</CardDescription>
            <CardTitle className="text-2xl font-bold text-red-500">-{results.maxDrawdown.toFixed(2)}%</CardTitle>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
        </CardHeader>
      </Card>
      
      <Card className="border border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>
            <CardDescription className="font-medium mb-1 text-gray-400">Sharpe Ratio</CardDescription>
            <CardTitle className="text-2xl font-bold text-purple-500">{results.sharpeRatio.toFixed(2)}</CardTitle>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Activity className="h-6 w-6 text-purple-500" />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MetricsCards;
