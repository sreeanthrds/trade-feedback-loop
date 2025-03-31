
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
import { Switch } from '@/components/ui/switch';

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
  const [useVpiFilter, setUseVpiFilter] = useState<boolean>(
    positionExpr.vpi && positionExpr.vpi !== '_any'
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
  const handleIdentifierTypeChange = (checked: boolean) => {
    setUseVpiFilter(checked);
    
    // Reset the indicators based on the filter type
    if (checked) {
      // Switching to VPI, reset VPT to _any
      updateExpression({
        ...positionExpr,
        vpt: '_any'
      });
    } else {
      // Switching to VPT, reset VPI to _any
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
    { value: 'unrealizedPnl', label: 'Unrealized P&L', description: 'The current paper profit or loss of the position that has not been realized yet' },
    { value: 'realizedPnl', label: 'Realized P&L', description: 'The actual profit or loss that has been locked in through closing all or part of the position' },
    { value: 'quantity', label: 'Position Size', description: 'The number of shares, contracts, or units in the position' },
    { value: 'entryPrice', label: 'Entry Price', description: 'The average price at which the position was opened' },
    { value: 'marketValue', label: 'Market Value', description: 'The current total value of the position at market price' },
    { value: 'costBasis', label: 'Cost Basis', description: 'The original amount invested in the position, including fees' },
    { value: 'percentChange', label: 'Percent Change', description: 'The percentage change in value since the position was opened' },
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
        <div className="flex items-center gap-1 mb-1">
          <Label htmlFor="position-field" className="text-xs">Position Field</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="max-w-xs text-xs">
                  Select what data you want to access from the position
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
                <div className="flex items-center gap-1">
                  {field.label}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="max-w-xs text-xs">{field.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {required && !positionExpr.field && (
          <p className="text-xs text-destructive mt-1">This field is required</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
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
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-semibold ${useVpiFilter ? 'text-muted-foreground' : 'text-indigo-500'}`}>
              Tag
            </span>
            <Switch
              checked={useVpiFilter}
              onCheckedChange={handleIdentifierTypeChange}
              id="filter-type-switch"
              className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-indigo-500"
            />
            <span className={`text-xs font-semibold ${useVpiFilter ? 'text-blue-500' : 'text-muted-foreground'}`}>
              ID
            </span>
          </div>
        </div>
      </div>

      {useVpiFilter ? (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Label htmlFor="position-vpi" className="text-xs">Position ID</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="max-w-xs text-xs">
                    Select a specific position by its unique identifier (VPI). Each position has a unique ID.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
              <SelectItem value="_any">
                <div className="flex items-center gap-1">
                  All Positions
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="max-w-xs text-xs">
                          Apply this condition to all positions in the strategy
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </SelectItem>
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
          <div className="flex items-center gap-1 mb-1">
            <Label htmlFor="position-vpt" className="text-xs">Position Tag</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="max-w-xs text-xs">
                    Filter positions by tag group. Tags can be shared by multiple positions.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
              <SelectItem value="_any">
                <div className="flex items-center gap-1">
                  All Tags
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="max-w-xs text-xs">
                          Apply this condition to positions with any tag
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </SelectItem>
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
