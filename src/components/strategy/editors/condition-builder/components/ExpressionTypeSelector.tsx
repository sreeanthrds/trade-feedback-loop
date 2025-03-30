
import React from 'react';
import { Expression, ExpressionType, createDefaultExpression } from '../../../utils/conditionTypes';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  BarChart4,
  Clock,
  DollarSign,
  FileText,
  LineChart,
  Radio,
  Tag
} from 'lucide-react';

interface ExpressionTypeSelectorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
}

interface ExpressionTypeOption {
  value: ExpressionType;
  label: string;
  icon: React.ReactNode;
  group: string;
}

const expressionTypeOptions: ExpressionTypeOption[] = [
  {
    value: 'market_data',
    label: 'Market Data',
    icon: <BarChart4 className="h-4 w-4 mr-2" />,
    group: 'Market'
  },
  {
    value: 'indicator',
    label: 'Indicator',
    icon: <LineChart className="h-4 w-4 mr-2" />,
    group: 'Market'
  },
  {
    value: 'constant',
    label: 'Constant',
    icon: <Radio className="h-4 w-4 mr-2" />,
    group: 'Basic'
  },
  {
    value: 'time_function',
    label: 'Time',
    icon: <Clock className="h-4 w-4 mr-2" />,
    group: 'Basic'
  },
  {
    value: 'position_data',
    label: 'Position Data',
    icon: <Tag className="h-4 w-4 mr-2" />,
    group: 'Position'
  },
  {
    value: 'strategy_metric',
    label: 'Strategy Metric',
    icon: <DollarSign className="h-4 w-4 mr-2" />,
    group: 'Position'
  },
  {
    value: 'execution_data',
    label: 'Execution Data',
    icon: <FileText className="h-4 w-4 mr-2" />,
    group: 'Advanced'
  },
  {
    value: 'external_trigger',
    label: 'External Trigger',
    icon: <Radio className="h-4 w-4 mr-2" />,
    group: 'Advanced'
  },
  {
    value: 'expression',
    label: 'Math Expression',
    icon: <Activity className="h-4 w-4 mr-2" />,
    group: 'Advanced'
  }
];

const ExpressionTypeSelector: React.FC<ExpressionTypeSelectorProps> = ({
  expression,
  updateExpression
}) => {
  // Group options by category
  const groups = expressionTypeOptions.reduce((acc, option) => {
    if (!acc[option.group]) {
      acc[option.group] = [];
    }
    acc[option.group].push(option);
    return acc;
  }, {} as Record<string, ExpressionTypeOption[]>);

  const groupOrder = ['Market', 'Basic', 'Position', 'Advanced'];

  // Change expression type (indicator, market_data, constant, etc.)
  const onTypeChange = (type: ExpressionType) => {
    if (expression.type !== type) {
      const newExpr = createDefaultExpression(type);
      newExpr.id = expression.id; // Keep the same ID
      updateExpression(newExpr);
    }
  };

  return (
    <Select
      value={expression.type}
      onValueChange={(value) => onTypeChange(value as ExpressionType)}
    >
      <SelectTrigger className="h-8">
        <SelectValue placeholder="Select expression type" />
      </SelectTrigger>
      <SelectContent>
        {groupOrder.map(groupName => (
          <SelectGroup key={groupName}>
            <SelectLabel>{groupName}</SelectLabel>
            {groups[groupName]?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ExpressionTypeSelector;
