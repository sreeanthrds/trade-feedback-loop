
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Plus, Minus, Percent } from "lucide-react";

interface OperationSelectorProps {
  operation: '+' | '-' | '*' | '/' | '%' | '+%' | '-%';
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
          <SelectItem value="+%">
            <div className="flex items-center">
              <Plus className="h-3 w-3 mr-1" />
              <Percent className="h-3 w-3" />
              <span className="ml-1">Increase by %</span>
            </div>
          </SelectItem>
          <SelectItem value="-%">
            <div className="flex items-center">
              <Minus className="h-3 w-3 mr-1" />
              <Percent className="h-3 w-3" />
              <span className="ml-1">Decrease by %</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OperationSelector;
