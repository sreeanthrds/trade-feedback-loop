
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GroupCondition, createEmptyGroupCondition } from '../../utils/conditionTypes';
import ConditionBuilder from '../condition-builder/ConditionBuilder';

interface SignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (conditions: GroupCondition[]) => void;
}

const SignalNodeContent: React.FC<SignalNodeContentProps> = ({ 
  conditions, 
  updateConditions
}) => {
  // Ensure conditions is always a non-empty array
  const safeConditions = Array.isArray(conditions) && conditions.length > 0 
    ? conditions.map(condition => {
        if (!condition) {
          return createEmptyGroupCondition();
        }
        return condition;
      })
    : [createEmptyGroupCondition()];
  
  const handleAddConditionGroup = () => {
    const newConditions = [...safeConditions, createEmptyGroupCondition()];
    updateConditions(newConditions);
  };

  const updateConditionGroup = (index: number, updatedGroup: GroupCondition) => {
    if (index < 0 || index >= safeConditions.length) {
      console.error('Invalid index for updating condition group', index);
      return;
    }
    
    const newConditions = [...safeConditions];
    newConditions[index] = updatedGroup;
    updateConditions(newConditions);
  };

  const removeConditionGroup = (index: number) => {
    // Don't allow removing the last group
    if (safeConditions.length <= 1) {
      return;
    }
    
    const newConditions = safeConditions.filter((_, i) => i !== index);
    updateConditions(newConditions);
  };

  return (
    <div className="space-y-6">
      <div className="text-sm font-medium mb-2">Signal Conditions</div>
      
      {safeConditions.length === 0 ? (
        <div className="text-sm text-muted-foreground py-2">
          No conditions defined. Add a condition group to define when this signal is triggered.
        </div>
      ) : (
        <div className="space-y-4">
          {safeConditions.map((condition, index) => (
            <ConditionBuilder
              key={condition?.id || `group-${index}`}
              rootCondition={condition || createEmptyGroupCondition()}
              updateConditions={(updated) => updateConditionGroup(index, updated)}
              allowRemove={safeConditions.length > 1}
              parentUpdateFn={() => removeConditionGroup(index)}
            />
          ))}
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddConditionGroup}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Condition Group
      </Button>
    </div>
  );
};

export default SignalNodeContent;
