
import React from 'react';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  orientation?: 'vertical' | 'horizontal';
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  description,
  className = '',
  children,
  orientation = 'vertical',
}) => {
  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-2 min-w-[120px]">
          <Label htmlFor={htmlFor} className="text-sm whitespace-nowrap">
            {label}
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
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor} className="text-sm">
          {label}
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
      {children}
    </div>
  );
};

export default FormField;
