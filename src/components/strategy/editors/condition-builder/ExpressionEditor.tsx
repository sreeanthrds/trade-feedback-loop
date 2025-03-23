
import React, { useState } from 'react';
import { 
  Expression, 
  ExpressionType,
  createDefaultExpression
} from '../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Activity, Calculator, Clock, LineChart, Hash } from 'lucide-react';
import MarketDataSelector from './MarketDataSelector';
import IndicatorSelector from './IndicatorSelector';
import TimeSelector from './TimeSelector';
import ComplexExpressionEditor from './ComplexExpressionEditor';

interface ExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
  expression,
  updateExpression
}) => {
  // Change expression type (indicator, market_data, constant, etc.)
  const changeExpressionType = (type: ExpressionType) => {
    const newExpr = createDefaultExpression(type);
    newExpr.id = expression.id; // Keep the same ID
    updateExpression(newExpr);
  };

  // Get the icon for the expression type
  const getExpressionIcon = () => {
    switch (expression.type) {
      case 'indicator':
        return <Activity className="h-4 w-4" />;
      case 'market_data':
        return <LineChart className="h-4 w-4" />;
      case 'constant':
        return <Hash className="h-4 w-4" />;
      case 'time_function':
        return <Clock className="h-4 w-4" />;
      case 'expression':
        return <Calculator className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Update constant value
  const updateConstantValue = (value: string) => {
    if (expression.type === 'constant') {
      // Try to convert to number if possible
      const numValue = !isNaN(Number(value)) ? Number(value) : value;
      updateExpression({
        ...expression,
        value: numValue
      });
    }
  };

  // Render the appropriate editor based on expression type
  const renderExpressionEditor = () => {
    switch (expression.type) {
      case 'indicator':
        return (
          <IndicatorSelector
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      case 'market_data':
        return (
          <MarketDataSelector
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      case 'constant':
        return (
          <Input
            value={expression.value.toString()}
            onChange={(e) => updateConstantValue(e.target.value)}
            className="h-8"
          />
        );
      case 'time_function':
        return (
          <TimeSelector
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      case 'expression':
        return (
          <ComplexExpressionEditor
            expression={expression}
            updateExpression={updateExpression}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select 
          value={expression.type} 
          onValueChange={(v) => changeExpressionType(v as ExpressionType)}
        >
          <SelectTrigger className="h-8">
            <SelectValue>
              <div className="flex items-center gap-2">
                {getExpressionIcon()}
                <span>{expression.type}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="indicator">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Indicator</span>
              </div>
            </SelectItem>
            <SelectItem value="market_data">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Market Data</span>
              </div>
            </SelectItem>
            <SelectItem value="constant">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                <span>Constant</span>
              </div>
            </SelectItem>
            <SelectItem value="time_function">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Time Function</span>
              </div>
            </SelectItem>
            <SelectItem value="expression">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Expression</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {renderExpressionEditor()}
    </div>
  );
};

export default ExpressionEditor;
