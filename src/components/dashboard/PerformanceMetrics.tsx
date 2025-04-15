
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { BacktestResult } from '@/components/strategy/backtesting/types';

interface PerformanceMetricsProps {
  results: BacktestResult;
}

const PerformanceMetrics = ({ results }: PerformanceMetricsProps) => {
  return (
    <Card className="border-border bg-card/60">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Sharpe Ratio</TableCell>
              <TableCell className="text-right font-medium">{results.sharpeRatio.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Profit Factor</TableCell>
              <TableCell className="text-right font-medium">{results.profitFactor.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Total Trades</TableCell>
              <TableCell className="text-right font-medium">{results.tradesCount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
