
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SectorPerformanceBreakdownProps {
  results: BacktestResult;
}

const SectorPerformanceBreakdown: React.FC<SectorPerformanceBreakdownProps> = ({ results }) => {
  const sectorData = [
    { sector: 'Technology', return: 22.5, winRate: 65 },
    { sector: 'Finance', return: 12.3, winRate: 55 },
    { sector: 'Healthcare', return: 8.7, winRate: 50 },
    { sector: 'Energy', return: 15.6, winRate: 60 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Sector</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sectorData}>
            <XAxis dataKey="sector" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="return" fill="#8884d8" />
            <Bar dataKey="winRate" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SectorPerformanceBreakdown;
