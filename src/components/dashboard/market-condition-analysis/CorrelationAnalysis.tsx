
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';

interface CorrelationAnalysisProps {
  results: BacktestResult;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm"><span className="font-medium">Correlation:</span> {data.correlation.toFixed(2)}</p>
        <p className="text-sm"><span className="font-medium">Return:</span> {data.marketReturn.toFixed(2)}%</p>
        <p className="text-sm"><span className="font-medium">Strategy Return:</span> {data.strategyReturn.toFixed(2)}%</p>
      </div>
    );
  }

  return null;
};

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ results }) => {
  // Mock data - in a real implementation, we'd extract this from results
  const correlationData = [
    { 
      name: 'S&P 500', 
      correlation: 0.32, 
      marketReturn: 8.5, 
      strategyReturn: 12.2, 
      size: 100 
    },
    { 
      name: 'Nasdaq', 
      correlation: 0.45, 
      marketReturn: 11.2, 
      strategyReturn: 15.8, 
      size: 80 
    },
    { 
      name: 'Russell 2000', 
      correlation: 0.18, 
      marketReturn: 5.7, 
      strategyReturn: 10.1, 
      size: 70 
    },
    { 
      name: 'Dow Jones', 
      correlation: 0.22, 
      marketReturn: 7.3, 
      strategyReturn: 9.5, 
      size: 90 
    },
    { 
      name: 'VIX', 
      correlation: -0.38, 
      marketReturn: -4.5, 
      strategyReturn: 14.2, 
      size: 60 
    },
    { 
      name: 'Gold', 
      correlation: -0.15, 
      marketReturn: 3.8, 
      strategyReturn: 8.7, 
      size: 65 
    },
    { 
      name: 'US Treasury', 
      correlation: -0.25, 
      marketReturn: 2.1, 
      strategyReturn: 7.6, 
      size: 75 
    },
    { 
      name: 'Bitcoin', 
      correlation: 0.12, 
      marketReturn: 21.5, 
      strategyReturn: 11.9, 
      size: 50 
    }
  ];

  return (
    <Card className="col-span-1 row-span-1">
      <CardHeader>
        <CardTitle>Correlation Analysis</CardTitle>
        <CardDescription>How your strategy correlates with major market indices and assets</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="marketReturn" 
              name="Market Return" 
              unit="%" 
              domain={['dataMin', 'dataMax']} 
              label={{ 
                value: 'Market Return (%)', 
                position: 'insideBottom', 
                offset: -10 
              }} 
            />
            <YAxis 
              type="number" 
              dataKey="strategyReturn" 
              name="Strategy Return" 
              unit="%" 
              label={{ 
                value: 'Strategy Return (%)', 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine x={0} stroke="#666" />
            <ReferenceLine y={0} stroke="#666" />
            <Scatter 
              name="Benchmark Comparison" 
              data={correlationData} 
              fill="#8884d8" 
              shape="circle"
              legendType="square"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
