
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';

interface EquityChartProps {
  equityCurve: BacktestResult['equityCurve'];
}

const EquityChart = ({ equityCurve }: EquityChartProps) => {
  // Find the maximum and minimum values for reference lines
  const maxEquity = Math.max(...equityCurve.map(point => point.equity));
  const minEquity = Math.min(...equityCurve.map(point => point.equity));
  
  // Calculate start and current equity
  const startEquity = equityCurve[0]?.equity || 10000;
  const currentEquity = equityCurve[equityCurve.length - 1]?.equity || startEquity;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">Equity Curve</CardTitle>
            <CardDescription className="text-gray-400">Capital growth over time</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Current Equity</div>
            <div className="text-xl font-bold text-white">{formatCurrency(currentEquity)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurve}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3C" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                tick={{ fontSize: 12, fill: "#94A3B8" }}
                stroke="#2A2F3C"
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12, fill: "#94A3B8" }}
                stroke="#2A2F3C"
              />
              <Tooltip 
                formatter={(value: any) => {
                  return typeof value === 'number' ? [formatCurrency(value), 'Equity'] : [value, 'Equity'];
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                contentStyle={{ backgroundColor: 'rgba(22, 25, 35, 0.9)', borderColor: '#2A2F3C', color: '#fff' }}
              />
              <Legend />
              <ReferenceLine y={startEquity} stroke="#6B7280" strokeDasharray="3 3" />
              <ReferenceLine y={maxEquity} stroke="#10B981" strokeDasharray="3 3" label={{ value: "Max", position: "left", fill: "#10B981", fontSize: 10 }} />
              <ReferenceLine y={minEquity} stroke="#EF4444" strokeDasharray="3 3" label={{ value: "Min", position: "left", fill: "#EF4444", fontSize: 10 }} />
              <Area 
                type="monotone" 
                dataKey="equity" 
                stroke="#6366F1" 
                fill="url(#equityGradient)" 
                activeDot={{ r: 6, fill: "#818CF8" }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquityChart;
