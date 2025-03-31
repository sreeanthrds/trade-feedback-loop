
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface OperationSelectorProps {
  operation: '+' | '-' | '*' | '/' | '%';
  updateOperation: (value: string) => void;
  required?: boolean;
}

const OperationSelector: React.FC<OperationSelectorProps> = ({ 
  operation, 
  updateOperation,
  required = false
}) => {
  return (
    <div>
      <Select 
        value={operation} 
        onValueChange={updateOperation}
      >
        <SelectTrigger 
          className={cn(
            "w-24 h-8", 
            required && !operation && "border-red-300 focus:ring-red-200"
          )}
        >
          <SelectValue placeholder="Operation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="+">+</SelectItem>
          <SelectItem value="-">-</SelectItem>
          <SelectItem value="*">*</SelectItem>
          <SelectItem value="/">/</SelectItem>
          <SelectItem value="%">%</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OperationSelector;
