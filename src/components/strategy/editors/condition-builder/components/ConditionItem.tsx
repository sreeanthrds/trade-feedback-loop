
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GroupCondition, Condition, isGroupCondition } from '../../../utils/conditionTypes';
import ConditionBuilder from '../ConditionBuilder';
import SingleConditionEditor from '../SingleConditionEditor';

interface ConditionItemProps {
  condition: GroupCondition | Condition;
  index: number;
  level: number;
  updateCondition: (updated: GroupCondition | Condition) => void;
  removeCondition: () => void;
}

/**
 * Type guard to check if a condition is a GroupCondition
 */
const isGroup = (condition: GroupCondition | Condition): condition is GroupCondition => {
  return 'groupLogic' in condition && 'conditions' in condition;
};

const ConditionItem: React.FC<ConditionItemProps> = ({
  condition,
  index,
  level,
  updateCondition,
  removeCondition
}) => {
  // Safely handle the case where condition might be undefined
  if (!condition) {
    console.error('Condition is undefined in ConditionItem');
    return null;
  }

  // For group conditions, render a nested ConditionBuilder
  if (isGroup(condition)) {
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
        <ConditionBuilder
          rootCondition={condition}
          updateConditions={(updated) => updateCondition(updated)}
          level={level + 1}
          index={index}
        />
      </div>
    );
  }

  // Type guard has confirmed this is a simple condition, not a group
  // Ensure our condition has all required properties
  const safeCondition: Condition = {
    id: condition.id || `condition_${Math.random().toString(36).substr(2, 9)}`,
    lhs: condition.lhs || { type: 'indicator', value: '' },
    operator: condition.operator || '==',
    rhs: condition.rhs || { type: 'constant', value: 0 }
  };

  // For simple conditions, render the SingleConditionEditor
  return (
    <div className="border border-border rounded-md p-3 relative">
      <div className="absolute right-2 top-2">
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
      <SingleConditionEditor
        condition={safeCondition}
        updateCondition={updateCondition}
      />
    </div>
  );
};

export default ConditionItem;
