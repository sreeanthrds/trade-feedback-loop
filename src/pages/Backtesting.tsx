
import React from 'react';
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#161923]/60 backdrop-blur-sm hover:bg-[#1C202C]/60 transition-colors border-[#2A2F3C]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <BarChart2 className="mr-2 h-5 w-5 text-blue-500" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Analyze returns, drawdowns, and key performance metrics to evaluate your strategy
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161923]/60 backdrop-blur-sm hover:bg-[#1C202C]/60 transition-colors border-[#2A2F3C]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <LineChart className="mr-2 h-5 w-5 text-blue-500" />
                Trade History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Review individual trades with entry/exit points and performance metrics
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#161923]/60 backdrop-blur-sm hover:bg-[#1C202C]/60 transition-colors border-[#2A2F3C]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <PieChart className="mr-2 h-5 w-5 text-blue-500" />
                Strategy Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Compare multiple strategy variations to identify the most effective approach
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
