
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  description?: string; // Added description property
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  value,
  options,
  onChange,
  placeholder,
  className,
  disabled = false,
  required = false,
  description
}) => {
  // Format options to ensure they have consistent structure
  const formattedOptions = options.map(option => 
    typeof option === 'string' 
      ? { value: option, label: option } 
      : option
  );

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
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger 
          id={id}
          className={cn(
            className,
            required && !value && "border-red-300 focus:ring-red-200"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {formattedOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
