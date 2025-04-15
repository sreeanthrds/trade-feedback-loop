
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import { 
  ResponsiveContainer, 
  Treemap, 
  Tooltip
} from 'recharts';

interface SectorRotationImpactProps {
  results: BacktestResult;
}

// Custom rendering for the treemap
const CustomizedContent = (props: any) => {
  const { depth, x, y, width, height, index, name, value, fill } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {(width > 50 && height > 30) && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          fontWeight={500}
          dominantBaseline="middle"
        >
          {name}
        </text>
      )}
      {(width > 50 && height > 50) && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 15}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          dominantBaseline="middle"
        >
          {`${value.toFixed(1)}%`}
        </text>
      )}
    </g>
  );
};

const SectorRotationImpact: React.FC<SectorRotationImpactProps> = ({ results }) => {
  // Mock data - in a real implementation, we'd extract this from results
  const sectorData = [
    {
      name: 'Technology',
      children: [
        { name: 'Software', size: 22.5, fill: '#8884d8' },
        { name: 'Hardware', size: 15.2, fill: '#9984d8' },
        { name: 'Semiconductors', size: 18.7, fill: '#7984d8' }
      ]
    },
    {
      name: 'Finance',
      children: [
        { name: 'Banks', size: 9.3, fill: '#82ca9d' },
        { name: 'Insurance', size: 12.8, fill: '#72ca9d' },
        { name: 'Asset Management', size: 15.1, fill: '#92ca9d' }
      ]
    },
    {
      name: 'Healthcare',
      children: [
        { name: 'Biotechnology', size: 17.6, fill: '#ffc658' },
        { name: 'Medical Devices', size: 11.2, fill: '#efc658' },
        { name: 'Pharmaceuticals', size: 8.3, fill: '#dfc658' }
      ]
    },
    {
      name: 'Energy',
      children: [
        { name: 'Oil & Gas', size: 7.2, fill: '#ff8042' },
        { name: 'Renewable', size: 13.5, fill: '#ef8042' },
        { name: 'Utilities', size: 6.8, fill: '#df8042' }
      ]
    }
  ];

  return (
    <Card className="col-span-1 row-span-1">
      <CardHeader>
        <CardTitle>Sector Performance Impact</CardTitle>
        <CardDescription>How different market sectors contribute to your strategy's returns</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={sectorData}
            dataKey="size"
            // Removed the 'ratio' prop as it's not supported by the Treemap component
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
          >
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Return']}
              itemStyle={{ color: 'var(--foreground)' }}
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
              labelStyle={{ fontWeight: 'bold', color: 'var(--foreground)' }}
            />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SectorRotationImpact;
