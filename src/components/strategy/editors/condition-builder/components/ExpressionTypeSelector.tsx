
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
      onValueChange={(v) => onTypeChange(v as ExpressionType)}
    >
      <SelectTrigger className="h-8">
        <SelectValue>
          <div className="flex items-center gap-2">
            <ExpressionIcon type={type} />
            <span>{type}</span>
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
            <span>Time Function</span>
          </div>
        </SelectItem>
        <SelectItem value="expression">
          <div className="flex items-center gap-2">
            <ExpressionIcon type="expression" />
            <span>Expression</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ExpressionTypeSelector;
