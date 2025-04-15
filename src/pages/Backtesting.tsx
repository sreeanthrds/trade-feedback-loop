
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart2, LineChart, ArrowRightCircle, BarChart, PieChart } from 'lucide-react';
import BacktestConfigPanel from '@/components/strategy/backtesting/BacktestConfigPanel';
import { useBacktestingStore } from '@/components/strategy/backtesting/store';
import { useNavigate } from 'react-router-dom';

const BacktestingPage = () => {
  const { startBacktest, isRunning, results } = useBacktestingStore();
  const navigate = useNavigate();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="mb-6 pt-4">
        <h1 className="text-3xl font-bold mb-2">Options Backtesting Analytics</h1>
        <p className="text-foreground/70 mb-6">
          Test your strategy against historical data to analyze performance and optimize returns
        </p>
        
        {results && (
          <Button 
            className="mb-8" 
            size="lg" 
            onClick={() => navigate('/app/dashboard')}
          >
            View Backtest Results
            <ArrowRightCircle className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card hover:bg-card/90 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze returns, drawdowns, and key performance metrics to evaluate your strategy
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card hover:bg-card/90 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Trade History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Review individual trades with entry/exit points and performance metrics
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card hover:bg-card/90 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-primary" />
              Strategy Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compare multiple strategy variations to identify the most effective approach
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="border border-border rounded-xl p-4">
          <BacktestConfigPanel />
        </div>
      </div>
    </div>
  );
};

export default BacktestingPage;
