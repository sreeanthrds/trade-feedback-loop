
import React, { useMemo, useEffect, useState } from 'react';
import { Expression, PositionDataExpression } from '../../../utils/conditionTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PositionDataExpressionEditorProps {
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
}

const PositionDataExpressionEditor: React.FC<PositionDataExpressionEditorProps> = ({
  expression,
  updateExpression,
  required = false
}) => {
  if (expression.type !== 'position_data') {
    return null;
  }

  const positionExpr = expression as PositionDataExpression;
  const nodes = useStrategyStore(state => state.nodes);
  
  // State for identifier type selection
  const [identifierType, setIdentifierType] = useState<'vpi' | 'vpt'>(
    positionExpr.vpi && positionExpr.vpi !== '_any' ? 'vpi' : 'vpt'
  );
  
  // Extract VPI and VPT values from all nodes
  const positionIdentifiers = useMemo(() => {
    const vpiValues = new Set<string>();
    const vptValues = new Set<string>();
    const vpiToVptMap = new Map<string, string>();
    
    nodes.forEach(node => {
      if (node.data?.positions && Array.isArray(node.data.positions)) {
        node.data.positions.forEach((position: any) => {
          if (position.vpi) {
            vpiValues.add(position.vpi);
            if (position.vpt) {
              vpiToVptMap.set(position.vpi, position.vpt);
            }
          }
          if (position.vpt) vptValues.add(position.vpt);
        });
      }
    });
    
    return {
      vpiOptions: Array.from(vpiValues),
      vptOptions: Array.from(vptValues),
      vpiToVptMap
    };
  }, [nodes]);
  
  // Handle identifier type change
  const handleIdentifierTypeChange = (value: string) => {
    setIdentifierType(value as 'vpi' | 'vpt');
    
    // Reset the other identifier when type changes
    if (value === 'vpi') {
      updateExpression({
        ...positionExpr,
        vpt: '_any'
      });
    } else {
      updateExpression({
        ...positionExpr,
        vpi: '_any'
      });
    }
  };
  
  // Update the VPI
  const updateVPI = (value: string) => {
    if (value === '_any') {
      // If "All Positions" is selected
      updateExpression({
        ...positionExpr,
        vpi: value
      });
    } else {
      // If a specific position is selected, also update its associated VPT
      const associatedVpt = positionIdentifiers.vpiToVptMap.get(value) || '_any';
      updateExpression({
        ...positionExpr,
        vpi: value,
        vpt: associatedVpt
      });
    }
  };

  // Update the VPT
  const updateVPT = (value: string) => {
    updateExpression({
      ...positionExpr,
      vpt: value
    });
  };
  
  // Field options for position data
  const positionFields = [
    { value: 'unrealizedPnl', label: 'Unrealized P&L' },
    { value: 'realizedPnl', label: 'Realized P&L' },
    { value: 'quantity', label: 'Position Size' },
    { value: 'entryPrice', label: 'Entry Price' },
    { value: 'marketValue', label: 'Market Value' },
    { value: 'costBasis', label: 'Cost Basis' },
    { value: 'percentChange', label: 'Percent Change' },
  ];

  // Update the field
  const updateField = (value: string) => {
    updateExpression({
      ...positionExpr,
      field: value
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="position-field" className="text-xs block mb-1">Position Field</Label>
        <Select 
          value={positionExpr.field || ''} 
          onValueChange={updateField}
        >
          <SelectTrigger 
            id="position-field" 
            className={cn("h-8", required && !positionExpr.field && "border-red-300 focus:ring-red-200")}
          >
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {positionFields.map(field => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {required && !positionExpr.field && (
          <p className="text-xs text-destructive mt-1">This field is required</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1 mb-1">
          <Label className="text-xs">Filter By</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Choose how to identify positions - by their unique ID or by their tag group
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup
          value={identifierType}
          onValueChange={handleIdentifierTypeChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vpi" id="radio-vpi" />
            <Label htmlFor="radio-vpi" className="text-sm font-normal cursor-pointer">
              Position ID
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vpt" id="radio-vpt" />
            <Label htmlFor="radio-vpt" className="text-sm font-normal cursor-pointer">
              Position Tag
            </Label>
          </div>
        </RadioGroup>
      </div>

      {identifierType === 'vpi' ? (
        <div>
          <Label htmlFor="position-vpi" className="text-xs block mb-1">Position ID</Label>
          <Select
            value={positionExpr.vpi || '_any'}
            onValueChange={updateVPI}
          >
            <SelectTrigger 
              id="position-vpi" 
              className="h-8 text-xs"
            >
              <SelectValue placeholder="Select Position ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_any">All Positions</SelectItem>
              {positionIdentifiers.vpiOptions.map(vpi => (
                <SelectItem key={vpi} value={vpi}>
                  {vpi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label htmlFor="position-vpt" className="text-xs block mb-1">Position Tag</Label>
          <Select
            value={positionExpr.vpt || '_any'}
            onValueChange={updateVPT}
          >
            <SelectTrigger 
              id="position-vpt" 
              className="h-8 text-xs"
            >
              <SelectValue placeholder="Select Position Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_any">All Tags</SelectItem>
              {positionIdentifiers.vptOptions.map(vpt => (
                <SelectItem key={vpt} value={vpt}>
                  {vpt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default PositionDataExpressionEditor;
