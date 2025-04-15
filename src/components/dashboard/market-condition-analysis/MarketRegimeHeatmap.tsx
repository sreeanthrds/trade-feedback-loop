
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Circle } from 'lucide-react';

interface MarketRegimeHeatmapProps {
  results: BacktestResult;
}

type RegimeData = {
  regime: string;
  winRate: number;
  return: number;
  trades: number;
  avgDuration: number;
}

const MarketRegimeHeatmap: React.FC<MarketRegimeHeatmapProps> = ({ results }) => {
  // Real implementation would extract this data from results
  const regimeData: RegimeData[] = [
    { regime: 'Bull Market', return: 15.5, winRate: 68, trades: 124, avgDuration: 8.2 },
    { regime: 'Bear Market', return: -3.2, winRate: 42, trades: 87, avgDuration: 5.3 },
    { regime: 'Sideways Market', return: 5.7, winRate: 55, trades: 106, avgDuration: 6.8 },
    { regime: 'High Volatility', return: 9.2, winRate: 51, trades: 95, avgDuration: 4.7 },
    { regime: 'Low Volatility', return: 7.8, winRate: 63, trades: 118, avgDuration: 9.1 }
  ];

  // Custom cell renderer for the heatmap
  const renderHeatmapCell = (value: number, maxValue: number, isPositive: boolean = true) => {
    const intensity = Math.min(Math.abs(value) / maxValue, 1);
    const baseColor = isPositive ? "rgba(52, 211, 153, " : "rgba(248, 113, 113, ";
    const backgroundColor = `${baseColor}${intensity.toFixed(2)})`;
    
    return (
      <div className="w-full h-full flex items-center justify-center p-4" style={{ backgroundColor }}>
        <span className="text-sm font-semibold text-foreground">
          {isPositive ? '+' : ''}{value.toFixed(1)}%
        </span>
      </div>
    );
  };

  const maxReturn = Math.max(...regimeData.map(item => Math.abs(item.return)));

  return (
    <Card className="col-span-1 row-span-1">
      <CardHeader>
        <CardTitle>Performance by Market Regime</CardTitle>
        <CardDescription>How your strategy performs in different market conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[150px_1fr] gap-1 mb-4">
          <div className="font-medium text-sm">Market Regime</div>
          <div className="font-medium text-sm">Return</div>
        </div>
        
        {regimeData.map((item, index) => (
          <div key={item.regime} className="grid grid-cols-[150px_1fr] gap-1 mb-1">
            <div className="flex items-center text-sm">
              <Circle className="h-3 w-3 mr-2" style={{ fill: item.return > 0 ? '#34D399' : '#F87171' }} />
              {item.regime}
            </div>
            <div className="h-10">
              {renderHeatmapCell(item.return, maxReturn, item.return > 0)}
            </div>
          </div>
        ))}
        
        <div className="text-xs text-muted-foreground mt-4">
          Based on {regimeData.reduce((sum, item) => sum + item.trades, 0)} trades across different market conditions
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketRegimeHeatmap;
