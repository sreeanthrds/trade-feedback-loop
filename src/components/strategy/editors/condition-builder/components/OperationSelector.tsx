
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OperationType = '+' | '-' | '*' | '/' | '%';

interface OperationSelectorProps {
  operation: OperationType;
  updateOperation: (value: string) => void;
}

const OperationSelector: React.FC<OperationSelectorProps> = ({
  operation,
  updateOperation
}) => {
  return (
    <Select 
      value={operation} 
      onValueChange={updateOperation}
    >
      <SelectTrigger className="h-8 border border-input">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="+">Addition (+)</SelectItem>
        <SelectItem value="-">Subtraction (-)</SelectItem>
        <SelectItem value="*">Multiplication (×)</SelectItem>
        <SelectItem value="/">Division (÷)</SelectItem>
        <SelectItem value="%">Modulo (%)</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default OperationSelector;
