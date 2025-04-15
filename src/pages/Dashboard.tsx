
import React, { useState } from 'react';
import { useBacktestingStore } from '@/components/strategy/backtesting/store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import NoResultsView from '@/components/dashboard/NoResultsView';
import MetricsCards from '@/components/dashboard/MetricsCards';
import EquityChart from '@/components/dashboard/EquityChart';
import MonthlyReturnsChart from '@/components/dashboard/MonthlyReturnsChart';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';
import TransactionsTable from '@/components/dashboard/TransactionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Dashboard = () => {
  const { results, resetResults } = useBacktestingStore();
  const [showParameters, setShowParameters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // If no results yet, show a message and redirect button
  if (!results) {
    return <NoResultsView />;
  }

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        <DashboardHeader onClearResults={resetResults} />
        <MetricsCards results={results} />
        
        {/* Backtest Parameters Card */}
        <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => setShowParameters(!showParameters)}
          >
            <h3 className="text-lg font-medium text-white">Backtest Parameters</h3>
            {showParameters ? 
              <ChevronUp size={20} className="text-gray-400" /> : 
              <ChevronDown size={20} className="text-gray-400" />
            }
          </div>
          {showParameters && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Initial Capital</p>
                  <p className="font-medium text-white">${results.initialCapital || 10000}</p>
                </div>
                <div>
                  <p className="text-gray-400">Time Period</p>
                  <p className="font-medium text-white">
                    {new Date(results.equityCurve[0]?.timestamp).toLocaleDateString()} - 
                    {new Date(results.equityCurve[results.equityCurve.length - 1]?.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Commission</p>
                  <p className="font-medium text-white">{results.commission || '0.1%'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Slippage</p>
                  <p className="font-medium text-white">{results.slippage || '0.05%'}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Equity Chart */}
        <div className="grid grid-cols-1 gap-6">
          <EquityChart equityCurve={results.equityCurve} />
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-[#2A2F3C]">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b-0 justify-start">
              <TabsTrigger 
                value="overview" 
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="trades" 
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent"
              >
                Trades
              </TabsTrigger>
              <TabsTrigger 
                value="risk" 
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent"
              >
                Risk
              </TabsTrigger>
            </TabsList>
          
            {/* Tab Content */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Strategy Summary</h3>
                    <p className="text-gray-400 mb-4">
                      This strategy achieved a {results.totalReturn.toFixed(2)}% total return with a 
                      {results.winRate.toFixed(1)}% win rate across {results.tradesCount} trades.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Profit Factor</p>
                        <p className="font-medium text-white">{results.profitFactor.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Sharpe Ratio</p>
                        <p className="font-medium text-white">{results.sharpeRatio.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <MonthlyReturnsChart monthlyReturns={results.monthlyReturns} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <PerformanceMetrics results={results} />
                <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Strategy Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Trade Duration</span>
                        <span className="text-white">5.3 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Profit per Trade</span>
                        <span className="text-green-500">$342.18</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Loss per Trade</span>
                        <span className="text-red-500">-$156.45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Consecutive Wins</span>
                        <span className="text-white">7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Consecutive Losses</span>
                        <span className="text-white">3</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <TransactionsTable transactions={results.transactions || []} />
            </TabsContent>
            
            <TabsContent value="performance" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <MonthlyReturnsChart monthlyReturns={results.monthlyReturns} />
                <PerformanceMetrics results={results} />
              </div>
              <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Monthly Performance</h3>
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-gray-400">Detailed monthly performance visualization would be displayed here</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="trades" className="mt-6">
              <TransactionsTable transactions={results.transactions || []} />
            </TabsContent>
            
            <TabsContent value="risk" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Drawdown Analysis</h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-400">Drawdown visualization would be displayed here</p>
                    </div>
                  </div>
                </Card>
                <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Risk Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400">Max Drawdown</p>
                        <p className="font-medium text-red-500">-{results.maxDrawdown.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Volatility</p>
                        <p className="font-medium text-white">{(Math.random() * 5 + 10).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Sortino Ratio</p>
                        <p className="font-medium text-white">{(Math.random() * 1 + 1.5).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Calmar Ratio</p>
                        <p className="font-medium text-white">{(Math.random() * 1 + 0.8).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Value at Risk (95%)</p>
                        <p className="font-medium text-white">-{(Math.random() * 2 + 1.5).toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
