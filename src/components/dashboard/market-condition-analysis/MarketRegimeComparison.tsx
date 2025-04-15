
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MarketRegimeComparisonProps {
  results: BacktestResult;
}

const MarketRegimeComparison: React.FC<MarketRegimeComparisonProps> = ({ results }) => {
  const regimeData = [
    { name: 'Bull Market', value: 45, color: '#4CAF50' },
    { name: 'Bear Market', value: 25, color: '#F44336' },
    { name: 'Sideways Market', value: 30, color: '#2196F3' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Regime Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regimeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {regimeData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MarketRegimeComparison;
