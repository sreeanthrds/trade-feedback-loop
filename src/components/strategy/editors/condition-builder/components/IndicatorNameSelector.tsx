
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExpressionIcon from './ExpressionIcon';
import { cn } from '@/lib/utils';

interface IndicatorNameSelectorProps {
  indicatorName: string | undefined;
  availableIndicators: string[];
  missingIndicator: boolean;
  required?: boolean;
  onChange: (value: string) => void;
  getDisplayName: (key: string) => string;
  disabled?: boolean;
}

const IndicatorNameSelector: React.FC<IndicatorNameSelectorProps> = ({
  indicatorName,
  availableIndicators,
  missingIndicator,
  required = false,
  onChange,
  getDisplayName,
  disabled = false
}) => {
  return (
    <Select 
      value={indicatorName} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn(
        "h-8", 
        missingIndicator ? 'border-destructive' : '',
        required && !indicatorName && "border-red-300 focus:ring-red-200"
      )}>
        <SelectValue placeholder="Select indicator">
          {indicatorName && (
            <div className="flex items-center gap-2">
              <ExpressionIcon type="indicator" subType={indicatorName} />
              <span>{getDisplayName(indicatorName)}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableIndicators.length > 0 ? (
          availableIndicators.map((indicator) => (
            <SelectItem key={indicator} value={indicator}>
              <div className="flex items-center gap-2">
                <ExpressionIcon type="indicator" />
                <span>{getDisplayName(indicator)}</span>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No indicators available
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

export default IndicatorNameSelector;
