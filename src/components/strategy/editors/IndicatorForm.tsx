
import React from 'react';
import { Indicator, IndicatorParameter } from '../utils/indicatorConfig';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface IndicatorFormProps {
  indicator: Indicator;
  values: Record<string, any>;
  onChange: (paramName: string, value: any) => void;
}

const IndicatorForm: React.FC<IndicatorFormProps> = ({ 
  indicator, 
  values, 
  onChange 
}) => {
  const renderParameterInput = (param: IndicatorParameter) => {
    const value = values[param.name] !== undefined ? values[param.name] : param.default;
    
    switch (param.type) {
      case 'number':
        return (
          <div className="space-y-2" key={param.name}>
            <div className="flex items-center gap-2">
              <Label htmlFor={`param-${param.name}`} className="text-sm">
                {param.label}
              </Label>
              {param.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{param.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Input
              id={`param-${param.name}`}
              type="number"
              value={value}
              onChange={(e) => onChange(param.name, parseFloat(e.target.value))}
              className="h-8"
            />
          </div>
        );
        
      case 'dropdown':
        return (
          <div className="space-y-2" key={param.name}>
            <div className="flex items-center gap-2">
              <Label htmlFor={`param-${param.name}`} className="text-sm">
                {param.label}
              </Label>
              {param.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{param.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Select
              value={value}
              onValueChange={(val) => onChange(param.name, val)}
            >
              <SelectTrigger id={`param-${param.name}`} className="h-8">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {param.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'checkbox_group':
        return (
          <div className="space-y-2" key={param.name}>
            <div className="flex items-center gap-2">
              <Label className="text-sm">{param.label}</Label>
              {param.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{param.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex flex-col gap-2 pl-1">
              {param.options?.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <Checkbox
                    id={`param-${param.name}-${option}`}
                    checked={Array.isArray(value) && value.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange(param.name, [...(value || []), option]);
                      } else {
                        onChange(param.name, (value || []).filter((val: string) => val !== option));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`param-${param.name}-${option}`}
                    className="text-xs"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'radio_button':
        return (
          <div className="space-y-2" key={param.name}>
            <div className="flex items-center gap-2">
              <Label className="text-sm">{param.label}</Label>
              {param.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{param.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <RadioGroup
              value={value}
              onValueChange={(val) => onChange(param.name, val)}
              className="flex flex-col space-y-1"
            >
              {param.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`param-${param.name}-${option}`} />
                  <Label htmlFor={`param-${param.name}-${option}`} className="text-xs">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'boolean':
        return (
          <div className="flex items-center justify-between space-x-2" key={param.name}>
            <div className="flex items-center gap-2">
              <Label htmlFor={`param-${param.name}`} className="text-sm">
                {param.label}
              </Label>
              {param.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{param.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Switch
              id={`param-${param.name}`}
              checked={value}
              onCheckedChange={(checked) => onChange(param.name, checked)}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 bg-muted/40 p-3 rounded-md mt-1">
      {indicator.parameters.map((param) => renderParameterInput(param))}
    </div>
  );
};

export default IndicatorForm;
