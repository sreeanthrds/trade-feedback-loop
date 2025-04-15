
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
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>
            <CardDescription className="font-medium mb-1 text-muted-foreground">Total Return</CardDescription>
            <CardTitle className="text-2xl font-bold text-green-500">+{results.totalReturn.toFixed(2)}%</CardTitle>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500 opacity-80" />
        </CardHeader>
      </Card>
      
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>
            <CardDescription className="font-medium mb-1 text-muted-foreground">Win Rate</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-500">{results.winRate.toFixed(1)}%</CardTitle>
          </div>
          <Award className="h-8 w-8 text-blue-500 opacity-80" />
        </CardHeader>
      </Card>
      
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>
            <CardDescription className="font-medium mb-1 text-muted-foreground">Max Drawdown</CardDescription>
            <CardTitle className="text-2xl font-bold text-red-500">-{results.maxDrawdown.toFixed(2)}%</CardTitle>
          </div>
          <TrendingDown className="h-8 w-8 text-red-500 opacity-80" />
        </CardHeader>
      </Card>
      
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>
            <CardDescription className="font-medium mb-1 text-muted-foreground">Sharpe Ratio</CardDescription>
            <CardTitle className="text-2xl font-bold text-purple-500">{results.sharpeRatio.toFixed(2)}</CardTitle>
          </div>
          <Activity className="h-8 w-8 text-purple-500 opacity-80" />
        </CardHeader>
      </Card>
    </div>
  );
};

export default MetricsCards;
