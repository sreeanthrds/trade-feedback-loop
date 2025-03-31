
import React, { useMemo } from 'react';
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
  
  // Extract VPI and VPT values from all nodes
  const positionIdentifiers = useMemo(() => {
    const vpiValues = new Set<string>();
    const vptValues = new Set<string>();
    
    nodes.forEach(node => {
      if (node.data?.positions && Array.isArray(node.data.positions)) {
        node.data.positions.forEach((position: any) => {
          if (position.vpi) vpiValues.add(position.vpi);
          if (position.vpt) vptValues.add(position.vpt);
        });
      }
    });
    
    return {
      vpiOptions: Array.from(vpiValues),
      vptOptions: Array.from(vptValues)
    };
  }, [nodes]);
  
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

  // Update VPI
  const updateVPI = (value: string) => {
    updateExpression({
      ...positionExpr,
      vpi: value
    });
  };

  // Update VPT
  const updateVPT = (value: string) => {
    updateExpression({
      ...positionExpr,
      vpt: value
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

      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Label htmlFor="position-vpi" className="text-xs">Position ID</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Specify a VPI to check data for a specific position, or select "All Positions" to aggregate data across all positions.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={positionExpr.vpi || ''}
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
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Label htmlFor="position-vpt" className="text-xs">Position Tag</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Filter positions by tag to check data for similarly tagged positions, or select "All Tags" to ignore tag filtering.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={positionExpr.vpt || ''}
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
      </div>
    </div>
  );
};

export default PositionDataExpressionEditor;
