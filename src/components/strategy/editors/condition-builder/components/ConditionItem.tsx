
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  GroupCondition, 
  Condition, 
  isGroupCondition, 
  createEmptyCondition,
  createEmptyGroupCondition
} from '../../../utils/conditionTypes';
import ConditionBuilder from '../ConditionBuilder';
import SingleConditionEditor from '../SingleConditionEditor';
import ConditionErrorBoundary from './ConditionErrorBoundary';

interface ConditionItemProps {
  condition: GroupCondition | Condition;
  index: number;
  level: number;
  updateCondition: (updated: GroupCondition | Condition) => void;
  removeCondition: () => void;
}

const ConditionItem: React.FC<ConditionItemProps> = ({
  condition,
  index,
  level,
  updateCondition,
  removeCondition
}) => {
  // Handle case where condition is undefined
  if (!condition) {
    const emptyCondition = createEmptyCondition();
    return (
      <div className="border border-destructive/50 bg-destructive/10 rounded-md p-3 relative">
        <p className="text-xs text-destructive mb-2">Invalid condition detected</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateCondition(emptyCondition)}
        >
          Reset Condition
        </Button>
      </div>
    );
  }

  const resetCondition = () => {
    if (isGroupCondition(condition)) {
      updateCondition(createEmptyGroupCondition());
    } else {
      updateCondition(createEmptyCondition());
    }
  };

  const renderContent = () => {
    // For group conditions, render a nested ConditionBuilder
    if (isGroupCondition(condition)) {
      return (
        <ConditionBuilder
          rootCondition={condition}
          updateConditions={(updated) => updateCondition(updated)}
          level={level + 1}
          index={index}
        />
      );
    }

    // Type guard has confirmed this is a simple condition, not a group
    // Ensure our condition has all required properties
    const safeCondition: Condition = {
      id: condition.id || `condition_${Math.random().toString(36).substr(2, 9)}`,
      lhs: condition.lhs || createDefaultExpression('indicator'),
      operator: condition.operator || '==',
      rhs: condition.rhs || createDefaultExpression('constant')
    };

    // For simple conditions, render the SingleConditionEditor
    return (
      <SingleConditionEditor
        condition={safeCondition}
        updateCondition={updateCondition}
      />
    );
  };

  return (
    <div className="border border-border rounded-md p-3 relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={removeCondition}
          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <ConditionErrorBoundary onReset={resetCondition}>
        {renderContent()}
      </ConditionErrorBoundary>
    </div>
  );
};

export default ConditionItem;
