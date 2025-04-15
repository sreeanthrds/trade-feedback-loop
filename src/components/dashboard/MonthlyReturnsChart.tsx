
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface MonthlyReturnsChartProps {
  monthlyReturns?: Array<{ month: string; return: number }>;
}

// CustomBar component to apply conditional colors based on value
const CustomBar = (props: any) => {
  const { fill, x, y, width, height, value } = props;
  const barColor = value >= 0 ? "#4ADE80" : "#F87171";
  
  // Using rx and ry attributes instead of radius array
  return <rect x={x} y={y} width={width} height={height} fill={barColor} rx={4} ry={4} />;
};

const MonthlyReturnsChart = ({ monthlyReturns }: MonthlyReturnsChartProps) => {
  // Generate mock data if no data is provided
  const chartData = monthlyReturns || Array.from({ length: 6 }, (_, i) => ({
    month: new Date(Date.now() - (5-i) * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }),
    return: (Math.random() * 10 - 2) // Mock data
  }));
  
  return (
    <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Monthly Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3C" opacity={0.4} />
              <XAxis 
                dataKey="month" 
                stroke="#2A2F3C"
                tick={{ fill: "#94A3B8", fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`} 
                stroke="#2A2F3C"
                tick={{ fill: "#94A3B8", fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: any) => {
                  return typeof value === 'number' ? [`${value.toFixed(2)}%`, 'Return'] : [value, 'Return'];
                }} 
                contentStyle={{ backgroundColor: 'rgba(22, 25, 35, 0.9)', borderColor: '#2A2F3C', color: '#fff' }}
              />
              <Bar 
                dataKey="return" 
                shape={<CustomBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyReturnsChart;
