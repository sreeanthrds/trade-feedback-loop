
import React from 'react';
import { Card } from '@/components/ui/card';
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
  
  return <rect x={x} y={y} width={width} height={height} fill={barColor} rx={3} ry={3} />;
};

const MonthlyReturnsChart = ({ monthlyReturns }: MonthlyReturnsChartProps) => {
  // Generate mock data if no data is provided
  const chartData = monthlyReturns || Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
    return: (Math.random() * 20 - 5) // Mock data between -5% and 15%
  }));
  
  return (
    <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
      <div className="p-6 pb-2">
        <h3 className="text-lg font-medium text-white">Monthly Returns</h3>
      </div>
      <div className="p-4 pt-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
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
      </div>
    </Card>
  );
};

export default MonthlyReturnsChart;
