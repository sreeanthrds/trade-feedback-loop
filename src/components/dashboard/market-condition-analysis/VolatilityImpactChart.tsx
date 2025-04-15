
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VolatilityImpactChartProps {
  results: BacktestResult;
}

const VolatilityImpactChart: React.FC<VolatilityImpactChartProps> = ({ results }) => {
  const volatilityData = [
    { volatility: 'Low', return: 8.5, sharpeRatio: 1.2 },
    { volatility: 'Medium', return: 12.3, sharpeRatio: 1.5 },
    { volatility: 'High', return: 6.7, sharpeRatio: 0.8 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Return Performance by Volatility</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={volatilityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="volatility" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="return" stroke="#8884d8" />
            <Line type="monotone" dataKey="sharpeRatio" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolatilityImpactChart;
