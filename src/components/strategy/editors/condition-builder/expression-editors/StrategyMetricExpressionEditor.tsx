
import React from 'react';
import { Expression, StrategyMetricExpression } from '../../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface StrategyMetricExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const StrategyMetricExpressionEditor: React.FC<StrategyMetricExpressionEditorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  if (expression.type !== 'strategy_metric') {
    return null;
  }

  const strategyExpr = expression as StrategyMetricExpression;
  
  // Metric options
  const metricOptions = [
    { value: 'totalPnl', label: 'Total P&L' },
    { value: 'drawdown', label: 'Drawdown' },
    { value: 'winRate', label: 'Win Rate' },
    { value: 'avgWin', label: 'Average Win' },
    { value: 'avgLoss', label: 'Average Loss' },
    { value: 'profitFactor', label: 'Profit Factor' },
    { value: 'sharpeRatio', label: 'Sharpe Ratio' },
    { value: 'maxProfit', label: 'Max Profit' },
    { value: 'maxLoss', label: 'Max Loss' },
    { value: 'portfolioValue', label: 'Portfolio Value' },
  ];

  // Update the metric
  const updateMetric = (value: string) => {
    updateExpression({
      ...strategyExpr,
      metric: value
    });
  };

  return (
    <div>
      <Label htmlFor="strategy-metric" className="text-xs block mb-1">Strategy Metric</Label>
      <Select 
        value={strategyExpr.metric} 
        onValueChange={updateMetric}
      >
        <SelectTrigger 
          id="strategy-metric" 
          className={cn("h-8", required && !strategyExpr.metric && "border-red-300 focus:ring-red-200")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {metricOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StrategyMetricExpressionEditor;
