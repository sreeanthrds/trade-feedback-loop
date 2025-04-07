
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { useBacktestingStore } from '@/components/strategy/backtesting/useBacktestingStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { results, resetResults } = useBacktestingStore();
  const navigate = useNavigate();

  // If no results yet, show a message and redirect button
  if (!results) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">No Backtest Results</h1>
            <p className="text-foreground/70 mb-8">
              You need to run a backtest to see results here.
            </p>
            <Button onClick={() => navigate('/backtesting')}>
              Go to Backtesting
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6 pt-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Results Dashboard</h1>
              <p className="text-foreground/70">
                Analysis and performance metrics from your backtest
              </p>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={resetResults}>Clear Results</Button>
              <Button onClick={() => navigate('/backtesting')}>New Backtest</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-green-600">+{results.totalReturn.toFixed(2)}%</CardTitle>
                <CardDescription>Total Return</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">{results.winRate.toFixed(1)}%</CardTitle>
                <CardDescription>Win Rate</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-red-500">-{results.maxDrawdown.toFixed(2)}%</CardTitle>
                <CardDescription>Max Drawdown</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <CardDescription>Growth of capital over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.equityCurve}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Equity']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="equity" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Sharpe Ratio</TableCell>
                      <TableCell className="text-right">{results.sharpeRatio.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Profit Factor</TableCell>
                      <TableCell className="text-right">{results.profitFactor.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Trades</TableCell>
                      <TableCell className="text-right">{results.tradesCount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Array.from({ length: 6 }, (_, i) => ({
                      month: new Date(Date.now() - (5-i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
                      return: (Math.random() * 10 - 2) // Mock data
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Return']} />
                      <Bar 
                        dataKey="return" 
                        fill={(data) => data.return >= 0 ? "#4ade80" : "#f87171"}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
