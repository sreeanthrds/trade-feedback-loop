
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InputFieldProps {
  label: string;
  id: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  description?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  required = false,
  min,
  max,
  step,
  description
}) => {
  // For number inputs, handle empty value differently
  let inputValue = value;
  if (type === 'number' && (value === undefined || value === null || value === '')) {
    inputValue = '';
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Pass through all changes, including empty values
    onChange(e);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="flex items-center">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Input
        id={id}
        type={type}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(
          className,
          required && type === 'number' && inputValue === '' && "border-red-300 focus:ring-red-200",
          required && type === 'text' && inputValue === '' && "border-red-300 focus:ring-red-200"
        )}
        min={min}
        max={max}
        step={step}
      />
      {required && ((type === 'number' && inputValue === '') || (type === 'text' && inputValue === '')) && (
        <p className="text-xs text-red-500 mt-1">This field is required</p>
      )}
    </div>
  );
};

export default InputField;
