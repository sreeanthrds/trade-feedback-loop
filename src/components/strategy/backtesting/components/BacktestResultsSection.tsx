
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import { BacktestResult } from '../types';

interface BacktestResultsSectionProps {
  results: BacktestResult | null;
  resetResults: () => void;
  onChangeTab: (tab: string) => void;
}

const BacktestResultsSection: React.FC<BacktestResultsSectionProps> = ({ 
  results, 
  resetResults, 
  onChangeTab 
}) => {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Backtest Results</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure your backtest parameters and run a test to see results
        </p>
        <Button onClick={() => onChangeTab('settings')}>
          Go to Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Return</p>
              <p className="text-xl font-bold text-green-600">+{results.totalReturn.toFixed(2)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="text-xl font-bold">{results.winRate.toFixed(1)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
              <p className="text-xl font-bold">{results.sharpeRatio.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Max Drawdown</p>
              <p className="text-xl font-bold text-red-500">-{results.maxDrawdown.toFixed(2)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Trades</p>
              <p className="text-xl font-bold">{results.tradesCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Profit Factor</p>
              <p className="text-xl font-bold">{results.profitFactor.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Equity Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Equity chart visualization would be displayed here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={resetResults}
      >
        Configure New Backtest
      </Button>
    </div>
  );
};

export default BacktestResultsSection;
