
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart2, LineChart, ArrowRightCircle, PieChart, Zap } from 'lucide-react';
import BacktestConfigPanel from '@/components/strategy/backtesting/BacktestConfigPanel';
import { useBacktestingStore } from '@/components/strategy/backtesting/store';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BacktestingPage = () => {
  const { startBacktest, isRunning, results } = useBacktestingStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="container max-w-7xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="mb-6 pt-4">
          <h1 className="text-3xl font-bold mb-2 text-white">Options Backtesting Analytics</h1>
          <p className="text-gray-400 mb-6">
            Test your strategy against historical data to analyze performance and optimize returns
          </p>
          
          {results && (
            <Button 
              className="mb-8 bg-blue-600 hover:bg-blue-700 text-white" 
              size="lg" 
              onClick={() => navigate('/app/dashboard')}
            >
              View Backtest Results
              <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#161923]/60 backdrop-blur-sm hover:bg-[#1C202C]/60 transition-colors border-[#2A2F3C] relative overflow-hidden md:col-span-2">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
                Performance Analysis
              </CardTitle>
              <CardDescription className="text-gray-400">
                Analyze returns, drawdowns, and key performance metrics to evaluate your strategy effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Track historical performance with detailed equity curves, profit analytics, and risk-adjusted return metrics
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161923]/60 backdrop-blur-sm hover:bg-[#1C202C]/60 transition-colors border-[#2A2F3C] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <LineChart className="mr-2 h-5 w-5 text-green-500" />
                Trade Analysis
              </CardTitle>
              <CardDescription className="text-gray-400">
                Detailed trade-by-trade review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Examine entry/exit points, P&L per trade, and win/loss statistics
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161923]/60 backdrop-blur-sm hover:bg-[#1C202C]/60 transition-colors border-[#2A2F3C] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <PieChart className="mr-2 h-5 w-5 text-purple-500" />
                Risk Analysis
              </CardTitle>
              <CardDescription className="text-gray-400">
                Comprehensive risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Measure drawdowns, volatility, and risk-adjusted metrics
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="border border-[#2A2F3C] rounded-xl p-4 bg-[#161923]/30 backdrop-blur-sm">
            <BacktestConfigPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestingPage;
