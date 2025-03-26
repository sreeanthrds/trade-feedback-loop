
import React, { useCallback } from 'react';
import { 
  Condition, 
  GroupCondition, 
  createEmptyCondition,
  createEmptyGroupCondition
} from '../../utils/conditionTypes';
import GroupConditionTitle from './components/GroupConditionTitle';
import ConditionItem from './components/ConditionItem';
import ConditionActions from './components/ConditionActions';
import ConditionPreview from './components/ConditionPreview';
import EmptyConditionState from './components/EmptyConditionState';
import ConditionErrorBoundary from './components/ConditionErrorBoundary';

interface ConditionBuilderProps {
  rootCondition: GroupCondition;
  updateConditions: (updatedCondition: GroupCondition) => void;
  level?: number;
  parentUpdateFn?: (updated: GroupCondition | Condition) => void;
  allowRemove?: boolean;
  index?: number;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  rootCondition,
  updateConditions,
  level = 0,
  parentUpdateFn,
  allowRemove = false,
  index = 0
}) => {
  // Ensure we have a complete, valid rootCondition with all required properties
  if (!rootCondition) {
    console.error('rootCondition is undefined in ConditionBuilder');
    rootCondition = createEmptyGroupCondition();
  }
  
  const safeRootCondition: GroupCondition = {
    id: rootCondition.id || `group_${Math.random().toString(36).substr(2, 9)}`,
    groupLogic: rootCondition.groupLogic || 'AND',
    conditions: Array.isArray(rootCondition.conditions) ? rootCondition.conditions : []
  };

  // Add a new single condition to this group
  const addCondition = useCallback(() => {
    const newCondition = createEmptyCondition();
    const updatedRoot = { 
      ...safeRootCondition,
      conditions: [...safeRootCondition.conditions, newCondition]
    };
    updateConditions(updatedRoot);
  }, [safeRootCondition, updateConditions]);

  // Add a new nested group condition
  const addGroup = useCallback(() => {
    const newGroup = createEmptyGroupCondition();
    const updatedRoot = { 
      ...safeRootCondition,
      conditions: [...safeRootCondition.conditions, newGroup]
    };
    updateConditions(updatedRoot);
  }, [safeRootCondition, updateConditions]);

  // Update this group's logic operator (AND/OR)
  const updateGroupLogic = useCallback((value: string) => {
    const updatedRoot = { 
      ...safeRootCondition,
      groupLogic: value as 'AND' | 'OR' 
    };
    updateConditions(updatedRoot);
  }, [safeRootCondition, updateConditions]);

  // Update a specific condition within this group
  const updateChildCondition = useCallback((index: number, updated: Condition | GroupCondition) => {
    if (index < 0 || index >= safeRootCondition.conditions.length) {
      console.error('Invalid index for updateChildCondition', index);
      return;
    }
    
    const newConditions = [...safeRootCondition.conditions];
    newConditions[index] = updated;
    const updatedRoot = { ...safeRootCondition, conditions: newConditions };
    updateConditions(updatedRoot);
  }, [safeRootCondition, updateConditions]);

  // Remove a condition from this group
  const removeCondition = useCallback((index: number) => {
    // Don't remove the last condition
    if (safeRootCondition.conditions.length <= 1) {
      return;
    }
    
    if (index < 0 || index >= safeRootCondition.conditions.length) {
      console.error('Invalid index for removeCondition', index);
      return;
    }
    
    const newConditions = [...safeRootCondition.conditions];
    newConditions.splice(index, 1);
    const updatedRoot = { ...safeRootCondition, conditions: newConditions };
    updateConditions(updatedRoot);
  }, [safeRootCondition, updateConditions]);

  // Reset this condition group
  const resetGroup = useCallback(() => {
    const newGroup = createEmptyGroupCondition();
    newGroup.id = safeRootCondition.id; // Keep the same ID
    updateConditions(newGroup);
  }, [safeRootCondition.id, updateConditions]);

  // Remove this entire group
  const removeGroup = useCallback(() => {
    if (parentUpdateFn) {
      parentUpdateFn(createEmptyCondition());
    }
  }, [parentUpdateFn]);

  // Calculate indentation based on nesting level
  const indentStyle = {
    marginLeft: `${level * 16}px`,
    borderLeft: level > 0 ? '2px solid #e5e7eb' : 'none',
    paddingLeft: level > 0 ? '16px' : '0'
  };

  const hasConditions = Array.isArray(safeRootCondition.conditions) && safeRootCondition.conditions.length > 0;

  return (
    <ConditionErrorBoundary onReset={resetGroup}>
      <div className="space-y-3">
        <GroupConditionTitle 
          rootCondition={safeRootCondition}
          level={level}
          allowRemove={allowRemove}
          updateGroupLogic={updateGroupLogic}
          removeGroup={removeGroup}
        />

        <div style={indentStyle} className="space-y-3 pt-2">
          {!hasConditions && (
            <EmptyConditionState addCondition={addCondition} />
          )}
          
          {hasConditions && safeRootCondition.conditions.map((condition, idx) => (
            <div key={condition?.id || `condition-${idx}`} className="relative">
              <ConditionItem 
                condition={condition || createEmptyCondition()}
                index={idx}
                level={level}
                updateCondition={(updated) => updateChildCondition(idx, updated)}
                removeCondition={() => removeCondition(idx)}
              />
            </div>
          ))}

          <ConditionActions 
            addCondition={addCondition}
            addGroup={addGroup}
          />
        </div>

        {level === 0 && (
          <ConditionPreview rootCondition={safeRootCondition} />
        )}
      </div>
    </ConditionErrorBoundary>
  );
};

export default ConditionBuilder;
