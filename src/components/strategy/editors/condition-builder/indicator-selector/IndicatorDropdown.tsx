
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ExpressionIcon from '../components/ExpressionIcon';

interface IndicatorDropdownProps {
  indicatorName: string;
  onIndicatorChange: (value: string) => void;
  availableIndicators: string[];
  getIndicatorDisplayName: (key: string) => string;
  isMissingIndicator: boolean;
}

const IndicatorDropdown: React.FC<IndicatorDropdownProps> = ({
  indicatorName,
  onIndicatorChange,
  availableIndicators,
  getIndicatorDisplayName,
  isMissingIndicator
}) => {
  return (
    <Select 
      value={indicatorName} 
      onValueChange={onIndicatorChange}
      disabled={availableIndicators.length === 0}
    >
      <SelectTrigger className={`h-8 ${isMissingIndicator ? 'border-destructive' : ''}`}>
        <SelectValue placeholder="Select indicator">
          {indicatorName && (
            <div className="flex items-center gap-2">
              <ExpressionIcon type="indicator" subType={undefined} />
              <span>{getIndicatorDisplayName(indicatorName)}</span>
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
                <span>{getIndicatorDisplayName(indicator)}</span>
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

export default IndicatorDropdown;
