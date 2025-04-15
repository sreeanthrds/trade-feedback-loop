
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface VolatilityRegimeAnalysisProps {
  results: BacktestResult;
}

const VolatilityRegimeAnalysis: React.FC<VolatilityRegimeAnalysisProps> = ({ results }) => {
  // Mock data - in a real implementation, we'd extract this from results
  const volatilityData = [
    { regime: 'Very Low', annualizedReturn: 6.2, sharpeRatio: 1.4, maxDrawdown: -3.5 },
    { regime: 'Low', annualizedReturn: 8.1, sharpeRatio: 1.8, maxDrawdown: -5.2 },
    { regime: 'Medium', annualizedReturn: 9.7, sharpeRatio: 1.6, maxDrawdown: -8.1 },
    { regime: 'High', annualizedReturn: 12.3, sharpeRatio: 1.2, maxDrawdown: -12.5 },
    { regime: 'Very High', annualizedReturn: 15.8, sharpeRatio: 0.9, maxDrawdown: -18.3 },
  ];

  return (
    <Card className="col-span-1 row-span-1">
      <CardHeader>
        <CardTitle>Volatility Regime Analysis</CardTitle>
        <CardDescription>Performance metrics across different volatility environments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={volatilityData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="regime" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'maxDrawdown') {
                  return [`${value}%`, 'Max Drawdown'];
                }
                if (name === 'annualizedReturn') {
                  return [`${value}%`, 'Return'];
                }
                return [value, name === 'sharpeRatio' ? 'Sharpe Ratio' : name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="annualizedReturn" name="Return" fill="#8884d8" />
            <Bar yAxisId="left" dataKey="sharpeRatio" name="Sharpe Ratio" fill="#82ca9d" />
            <Bar yAxisId="right" dataKey="maxDrawdown" name="Max Drawdown" fill="#ff8042" />
            <ReferenceLine yAxisId="left" y={0} stroke="#666" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolatilityRegimeAnalysis;
