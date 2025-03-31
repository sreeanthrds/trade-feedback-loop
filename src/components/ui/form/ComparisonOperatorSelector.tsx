
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '==' | '!=';

export interface ComparisonOperatorSelectorProps {
  /**
   * Currently selected operator
   */
  value: ComparisonOperator;
  /**
   * Callback when operator changes
   */
  onValueChange: (value: ComparisonOperator) => void;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Which operators to include
   */
  operators?: ComparisonOperator[];
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean;
}

/**
 * A selector component for comparison operators
 */
const ComparisonOperatorSelector: React.FC<ComparisonOperatorSelectorProps> = ({
  value,
  onValueChange,
  required = false,
  className,
  operators = ['>', '<', '>=', '<=', '==', '!='],
  disabled = false
}) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as ComparisonOperator)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "w-16",
          required && !value && "border-red-300 focus:ring-red-200",
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {operators.includes('>') && <SelectItem value=">">{'>'}</SelectItem>}
        {operators.includes('<') && <SelectItem value="<">{'<'}</SelectItem>}
        {operators.includes('>=') && <SelectItem value=">=">{'≥'}</SelectItem>}
        {operators.includes('<=') && <SelectItem value="<=">{'≤'}</SelectItem>}
        {operators.includes('==') && <SelectItem value="==">{'='}</SelectItem>}
        {operators.includes('!=') && <SelectItem value="!=">{'≠'}</SelectItem>}
      </SelectContent>
    </Select>
  );
};

export default ComparisonOperatorSelector;
