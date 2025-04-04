
import React, { useMemo } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Expression, createDefaultExpression } from '../../../utils/conditions';
import ExpressionIcon from './ExpressionIcon';

interface ExpressionTypeSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  conditionContext?: 'entry' | 'exit';
}

const ExpressionTypeSelector: React.FC<ExpressionTypeSelectorProps> = ({
  expression,
  updateExpression,
  conditionContext = 'entry'
}) => {
  // Filter expression types based on condition context
  const expressionTypes = useMemo(() => {
    const types = [
      { value: 'market_data', label: 'Market Data', group: 'Basic' },
      { value: 'indicator', label: 'Indicator', group: 'Basic' },
      { value: 'constant', label: 'Constant Value', group: 'Basic' },
      { value: 'time_function', label: 'Time', group: 'Basic' },
      { value: 'expression', label: 'Formula/Expression', group: 'Advanced' },
    ];

    // Position-related expressions - only show for exit conditions or shared
    if (conditionContext === 'exit') {
      types.push(
        { value: 'position_data', label: 'Position Data', group: 'Position' },
        { value: 'strategy_metric', label: 'Strategy Metric', group: 'Position' },
        { value: 'execution_data', label: 'Execution Data', group: 'Position' }
      );
    }

    // External triggers - available for both entry and exit
    types.push({ value: 'external_trigger', label: 'External Trigger', group: 'Advanced' });

    return types;
  }, [conditionContext]);

  const handleTypeChange = (value: string) => {
    // Create a new expression of the selected type
    const newExpression = createDefaultExpression(value as any);
    updateExpression(newExpression);
  };

  return (
    <Select
      value={expression.type}
      onValueChange={handleTypeChange}
    >
      <SelectTrigger className="h-7 text-xs w-auto min-w-32">
        <SelectValue placeholder="Expression type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Basic Types</SelectLabel>
          {expressionTypes
            .filter(type => type.group === 'Basic')
            .map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <ExpressionIcon type={type.value as any} />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
        
        {conditionContext === 'exit' && (
          <SelectGroup>
            <SelectLabel>Position Types</SelectLabel>
            {expressionTypes
              .filter(type => type.group === 'Position')
              .map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <ExpressionIcon type={type.value as any} />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
          </SelectGroup>
        )}
        
        <SelectGroup>
          <SelectLabel>Advanced Types</SelectLabel>
          {expressionTypes
            .filter(type => type.group === 'Advanced')
            .map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <ExpressionIcon type={type.value as any} />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ExpressionTypeSelector;
