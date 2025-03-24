
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  description?: string;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

const SwitchField: React.FC<SwitchFieldProps> = ({
  label,
  checked,
  onCheckedChange,
  id,
  description,
  className = '',
  orientation = 'horizontal',
}) => {
  return (
    <div className={`flex items-center ${orientation === 'horizontal' ? 'justify-between' : 'justify-between'} space-x-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm">
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
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};

export default SwitchField;
