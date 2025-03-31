
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExpressionIcon from './ExpressionIcon';
import { cn } from '@/lib/utils';

interface IndicatorParameterSelectorProps {
  parameter: string | undefined;
  parameters: string[];
  onParameterChange: (value: string) => void;
  required?: boolean;
}

const IndicatorParameterSelector: React.FC<IndicatorParameterSelectorProps> = ({
  parameter,
  parameters,
  onParameterChange,
  required = false
}) => {
  return (
    <Select 
      value={parameter} 
      onValueChange={onParameterChange}
    >
      <SelectTrigger className={cn(
        "h-8",
        required && !parameter && "border-red-300 focus:ring-red-200"
      )}>
        <SelectValue placeholder="Select output">
          {parameter && (
            <div className="flex items-center gap-2">
              <ExpressionIcon type="indicator" subType={parameter} />
              <span>{parameter}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {parameters.map((param) => (
          <SelectItem key={param} value={param}>
            <div className="flex items-center gap-2">
              <ExpressionIcon type="indicator" subType={param} />
              <span>{param}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default IndicatorParameterSelector;
