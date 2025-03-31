
import React from 'react';
import { Label } from '@/components/ui/label';
import { OperationSelector, MathOperation } from '@/components/ui/form';
import { FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface MathOperationControlProps {
  label: string;
  value: MathOperation;
  onChange: (value: MathOperation) => void;
  id?: string;
  required?: boolean;
  error?: string;
  className?: string;
  description?: string;
}

const MathOperationControl: React.FC<MathOperationControlProps> = ({
  label,
  value,
  onChange,
  id,
  required = false,
  error,
  className,
  description
}) => {
  return (
    <FormItem className={cn("space-y-1", className)}>
      <FormLabel htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>
      <FormControl>
        <OperationSelector
          value={value}
          onValueChange={onChange}
          required={required}
        />
      </FormControl>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};

export default MathOperationControl;
