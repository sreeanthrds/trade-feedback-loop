
import React from 'react';
import { Expression } from '../../../utils/conditions';
import { expressionEditorMap } from '../expression-editors';
import { Label } from '@/components/ui/label';
import ExpressionTypeSelector from './ExpressionTypeSelector';
import { useReactFlow } from '@xyflow/react';

interface ExpressionWrapperProps {
  label: string;
  expression: Expression;
  updateExpression: (expr: Expression) => void;
  required?: boolean;
  showLabels?: boolean;
  conditionContext?: 'entry' | 'exit';
}

const ExpressionWrapper: React.FC<ExpressionWrapperProps> = ({
  label,
  expression,
  updateExpression,
  required = false,
  showLabels = true,
  conditionContext = 'entry'
}) => {
  const { getNodes } = useReactFlow();
  
  // Get the current instrument symbol from the start node
  const getInstrumentName = (): string => {
    const nodes = getNodes();
    const startNode = nodes.find(node => node.type === 'startNode');
    
    // Explicitly cast to string with type assertion to guarantee a string return
    return (startNode?.data?.symbol as string) || 'Instrument';
  };
  
  // Get the appropriate editor component for this expression type
  const EditorComponent = expression ? expressionEditorMap[expression.type] : null;

  // Extract only the props that each editor component accepts
  const commonEditorProps = {
    expression,
    updateExpression,
    required
  };

  return (
    <div className="space-y-2 overflow-visible w-full">
      {showLabels && (
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          <ExpressionTypeSelector 
            expression={expression} 
            updateExpression={updateExpression}
            conditionContext={conditionContext}
            instrumentName={getInstrumentName()}
          />
        </div>
      )}
      
      {!showLabels && (
        <div className="flex justify-end">
          <ExpressionTypeSelector 
            expression={expression} 
            updateExpression={updateExpression}
            conditionContext={conditionContext}
            instrumentName={getInstrumentName()}
          />
        </div>
      )}
      
      {EditorComponent && (
        <EditorComponent
          {...commonEditorProps}
        />
      )}
    </div>
  );
};

export default ExpressionWrapper;
