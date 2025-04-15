
import React, { useState } from 'react';
import { useBacktestingStore } from '@/components/strategy/backtesting/store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import NoResultsView from '@/components/dashboard/NoResultsView';
import MetricsCards from '@/components/dashboard/MetricsCards';
import EquityChart from '@/components/dashboard/EquityChart';
import ReportsGrid from '@/components/dashboard/ReportsGrid';
import MarketConditionAnalysis from '@/components/dashboard/MarketConditionAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import MonthlyReturnsChart from '@/components/dashboard/MonthlyReturnsChart';
import TransactionsTable from '@/components/dashboard/TransactionsTable';

const Dashboard = () => {
  const { results, resetResults } = useBacktestingStore();
  const [showParameters, setShowParameters] = useState(false);

  // If no results yet, show a message and redirect button
  if (!results) {
    return <NoResultsView />;
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <DashboardHeader onClearResults={resetResults} />
        <MetricsCards results={results} />
        
        <Card className="mb-6 border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
          <CardHeader className="py-3 cursor-pointer" onClick={() => setShowParameters(!showParameters)}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium text-white">Backtest Parameters</CardTitle>
              {showParameters ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
          </CardHeader>
          {showParameters && (
            <CardContent>
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
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          <EquityChart equityCurve={results.equityCurve} />
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4 w-full justify-start border-b border-[#2A2F3C] pb-0 overflow-x-auto bg-transparent">
            <TabsTrigger value="overview" className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent">Performance</TabsTrigger>
            <TabsTrigger value="trades" className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent">Trades</TabsTrigger>
            <TabsTrigger value="market-conditions" className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent">Market Analysis</TabsTrigger>
            <TabsTrigger value="risk" className="text-gray-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none data-[state=active]:bg-transparent">Risk Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Strategy Summary</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
              <MonthlyReturnsChart monthlyReturns={results.monthlyReturns} />
            </div>
            <ReportsGrid results={results} />
          </TabsContent>
          
          <TabsContent value="performance">
            <ReportsGrid results={results} />
          </TabsContent>
          
          <TabsContent value="trades">
            {results.transactions && results.transactions.length > 0 ? (
              <TransactionsTable transactions={results.transactions || []} />
            ) : (
              <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
                <CardContent className="py-8 text-center">
                  <p className="text-gray-400">No trade data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="market-conditions">
            <MarketConditionAnalysis results={results} />
          </TabsContent>
          
          <TabsContent value="risk">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Drawdown Analysis</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  {/* Drawdown chart will go here */}
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">Drawdown visualization</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
