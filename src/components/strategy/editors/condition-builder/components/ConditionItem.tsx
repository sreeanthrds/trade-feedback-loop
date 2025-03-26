
import React from 'react';
import { Condition, GroupCondition, createEmptyCondition, createEmptyGroupCondition } from '../../../utils/conditionTypes';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import SingleConditionEditor from '../SingleConditionEditor';
import ConditionBuilder from '../ConditionBuilder';

interface ConditionItemProps {
  condition: Condition | GroupCondition;
  index: number;
  level: number;
  updateCondition: (updated: Condition | GroupCondition) => void;
  removeCondition: () => void;
}

const ConditionItem: React.FC<ConditionItemProps> = ({
  condition,
  index,
  level,
  updateCondition,
  removeCondition,
}) => {
  // Handle potentially undefined or invalid condition
  if (!condition) {
    // If condition is undefined, create an empty condition as a fallback
    const fallbackCondition = createEmptyCondition();
    return (
      <div className="flex items-start">
        <div className="flex-grow">
          <SingleConditionEditor
            condition={fallbackCondition}
            updateCondition={(updated) => updateCondition(updated)}
          />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={removeCondition} 
          className="ml-2 h-8 w-8 p-0 mt-1"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    );
  }
  
  // Check if this is a group condition (has groupLogic and conditions array)
  if ('groupLogic' in condition && condition.groupLogic) {
    // Ensure the group condition has all required properties
    const safeGroupCondition: GroupCondition = {
      id: condition.id || `group_${Math.random().toString(36).substr(2, 9)}`,
      groupLogic: condition.groupLogic || 'AND',
      conditions: Array.isArray(condition.conditions) ? condition.conditions : []
    };
    
    // Render nested group condition
    return (
      <ConditionBuilder
        rootCondition={safeGroupCondition}
        updateConditions={(updated) => updateCondition(updated)}
        level={level + 1}
        parentUpdateFn={(updated) => updateCondition(updated)}
        allowRemove={true}
        index={index}
      />
    );
  } else {
    // Ensure the condition has all required properties for a single condition
    const safeCondition: Condition = {
      id: condition.id || `cond_${Math.random().toString(36).substr(2, 9)}`,
      lhs: condition.lhs || createEmptyCondition().lhs,
      operator: condition.operator || '>',
      rhs: condition.rhs || createEmptyCondition().rhs
    };
    
    // Render single condition
    return (
      <div className="flex items-start">
        <div className="flex-grow">
          <SingleConditionEditor
            condition={safeCondition}
            updateCondition={(updated) => updateCondition(updated)}
          />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={removeCondition} 
          className="ml-2 h-8 w-8 p-0 mt-1"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    );
  }
};

export default ConditionItem;
