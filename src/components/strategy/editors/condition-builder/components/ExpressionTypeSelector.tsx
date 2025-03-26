
import React from 'react';
import { ExpressionType } from '../../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ExpressionIcon from './ExpressionIcon';

interface ExpressionTypeSelectorProps {
  type: ExpressionType;
  onTypeChange: (type: ExpressionType) => void;
}

const ExpressionTypeSelector: React.FC<ExpressionTypeSelectorProps> = ({
  type,
  onTypeChange
}) => {
  return (
    <Select 
      value={type} 
      onValueChange={(value) => onTypeChange(value as ExpressionType)}
    >
      <SelectTrigger className="h-8 w-full">
        <SelectValue placeholder="Select type">
          <div className="flex items-center gap-2">
            <ExpressionIcon type={type} />
            <span>{getExpressionTypeLabel(type)}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="indicator">
          <div className="flex items-center gap-2">
            <ExpressionIcon type="indicator" />
            <span>Indicator</span>
          </div>
        </SelectItem>
        
        <SelectItem value="market_data">
          <div className="flex items-center gap-2">
            <ExpressionIcon type="market_data" />
            <span>Market Data</span>
          </div>
        </SelectItem>
        
        <SelectItem value="constant">
          <div className="flex items-center gap-2">
            <ExpressionIcon type="constant" />
            <span>Constant</span>
          </div>
        </SelectItem>
        
        <SelectItem value="time_function">
          <div className="flex items-center gap-2">
            <ExpressionIcon type="time_function" />
            <span>Time</span>
          </div>
        </SelectItem>
        
        <SelectItem value="expression">
          <div className="flex items-center gap-2">
            <ExpressionIcon type="expression" />
            <span>Complex</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

function getExpressionTypeLabel(type: ExpressionType): string {
  switch (type) {
    case 'indicator': return 'Indicator';
    case 'market_data': return 'Market Data';
    case 'constant': return 'Constant';
    case 'time_function': return 'Time';
    case 'expression': return 'Complex';
    default: return 'Unknown';
  }
}

export default ExpressionTypeSelector;
