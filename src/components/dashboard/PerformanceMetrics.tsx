
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { BacktestResult } from '@/components/strategy/backtesting/types';

interface PerformanceMetricsProps {
  results: BacktestResult;
}

const PerformanceMetrics = ({ results }: PerformanceMetricsProps) => {
  return (
    <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow className="border-[#2A2F3C]">
              <TableCell className="text-gray-400">Sharpe Ratio</TableCell>
              <TableCell className="text-right font-medium text-white">{results.sharpeRatio.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow className="border-[#2A2F3C]">
              <TableCell className="text-gray-400">Profit Factor</TableCell>
              <TableCell className="text-right font-medium text-white">{results.profitFactor.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow className="border-[#2A2F3C]">
              <TableCell className="text-gray-400">Total Trades</TableCell>
              <TableCell className="text-right font-medium text-white">{results.tradesCount}</TableCell>
            </TableRow>
            <TableRow className="border-[#2A2F3C]">
              <TableCell className="text-gray-400">Win/Loss Ratio</TableCell>
              <TableCell className="text-right font-medium text-white">{(results.winRate / (100 - results.winRate)).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow className="border-[#2A2F3C]">
              <TableCell className="text-gray-400">Avg. Holding Period</TableCell>
              <TableCell className="text-right font-medium text-white">5.2 days</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
