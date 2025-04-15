
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RegimePerfHeatmapProps {
  results: BacktestResult;
}

const RegimePerfHeatmap: React.FC<RegimePerfHeatmapProps> = ({ results }) => {
  // Mock data for demonstration
  const regimeData = [
    { regime: 'Bull Market', return: 15.5, winRate: 68 },
    { regime: 'Bear Market', return: -3.2, winRate: 42 },
    { regime: 'Sideways Market', return: 5.7, winRate: 55 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Market Regime</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regimeData}>
            <XAxis dataKey="regime" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="return" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RegimePerfHeatmap;
