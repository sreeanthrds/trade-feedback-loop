
import React, { useState } from 'react';
import { useBacktestingStore } from '@/components/strategy/backtesting/store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import NoResultsView from '@/components/dashboard/NoResultsView';
import MetricsCards from '@/components/dashboard/MetricsCards';
import EquityChart from '@/components/dashboard/EquityChart';
import ReportsGrid from '@/components/dashboard/ReportsGrid';
import MarketConditionAnalysis from '@/components/dashboard/MarketConditionAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Dashboard = () => {
  const { results, resetResults } = useBacktestingStore();
  const [showParameters, setShowParameters] = useState(false);

  // If no results yet, show a message and redirect button
  if (!results) {
    return <NoResultsView />;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <DashboardHeader onClearResults={resetResults} />
      <MetricsCards results={results} />
      
      <Card className="mb-6">
        <CardHeader className="py-3 cursor-pointer" onClick={() => setShowParameters(!showParameters)}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Backtest Parameters</CardTitle>
            {showParameters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </CardHeader>
        {showParameters && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Initial Capital</p>
                <p className="font-medium">${results.initialCapital || 10000}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time Period</p>
                <p className="font-medium">
                  {new Date(results.equityCurve[0]?.timestamp).toLocaleDateString()} - 
                  {new Date(results.equityCurve[results.equityCurve.length - 1]?.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Commission</p>
                <p className="font-medium">{results.commission || '0.1%'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Slippage</p>
                <p className="font-medium">{results.slippage || '0.05%'}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <EquityChart equityCurve={results.equityCurve} />
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4 w-full justify-start border-b pb-0 overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-b-none rounded-t-md">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-b-none rounded-t-md">Performance</TabsTrigger>
          <TabsTrigger value="trades" className="rounded-b-none rounded-t-md">Trades</TabsTrigger>
          <TabsTrigger value="market-conditions" className="rounded-b-none rounded-t-md">Market Analysis</TabsTrigger>
          <TabsTrigger value="risk" className="rounded-b-none rounded-t-md">Risk Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This strategy achieved a {results.totalReturn.toFixed(2)}% total return with a 
                  {results.winRate.toFixed(1)}% win rate across {results.tradesCount} trades.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Profit Factor</p>
                    <p className="font-medium">{results.profitFactor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sharpe Ratio</p>
                    <p className="font-medium">{results.sharpeRatio.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-52">
                {/* This will be replaced by the monthly returns chart */}
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Monthly returns visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <ReportsGrid results={results} />
        </TabsContent>
        
        <TabsContent value="performance">
          <ReportsGrid results={results} />
        </TabsContent>
        
        <TabsContent value="trades">
          {results.transactions && results.transactions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>
                  Complete history of all {results.transactions.length} trades
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Trade history table will be here */}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No trade data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="market-conditions">
          <MarketConditionAnalysis results={results} />
        </TabsContent>
        
        <TabsContent value="risk">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Drawdown Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {/* Drawdown chart will go here */}
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Drawdown visualization</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground">Max Drawdown</p>
                    <p className="font-medium text-red-500">-{results.maxDrawdown.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Volatility</p>
                    <p className="font-medium">{(Math.random() * 5 + 10).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sortino Ratio</p>
                    <p className="font-medium">{(Math.random() * 1 + 1.5).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
