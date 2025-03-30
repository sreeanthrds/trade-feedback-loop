
import React from 'react';
import { ComparisonOperator } from '../../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OperatorSelectorProps {
  operator: ComparisonOperator;
  updateOperator: (value: string) => void;
}

const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  operator,
  updateOperator
}) => {
  return (
    <Select 
      value={operator} 
      onValueChange={updateOperator}
    >
      <SelectTrigger className="w-16">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=">">{'>'}</SelectItem>
        <SelectItem value="<">{'<'}</SelectItem>
        <SelectItem value=">=">{'≥'}</SelectItem>
        <SelectItem value="<=">{'≤'}</SelectItem>
        <SelectItem value="==">{'='}</SelectItem>
        <SelectItem value="!=">{'≠'}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OperatorSelector;
