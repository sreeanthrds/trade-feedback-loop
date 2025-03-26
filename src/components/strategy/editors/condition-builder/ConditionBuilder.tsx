
import React from 'react';
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
  const addCondition = () => {
    const newCondition = createEmptyCondition();
    const updatedRoot = { 
      ...safeRootCondition,
      conditions: [...safeRootCondition.conditions, newCondition]
    };
    updateConditions(updatedRoot);
  };

  // Add a new nested group condition
  const addGroup = () => {
    const newGroup = createEmptyGroupCondition();
    const updatedRoot = { 
      ...safeRootCondition,
      conditions: [...safeRootCondition.conditions, newGroup]
    };
    updateConditions(updatedRoot);
  };

  // Update this group's logic operator (AND/OR)
  const updateGroupLogic = (value: string) => {
    const updatedRoot = { 
      ...safeRootCondition,
      groupLogic: value as 'AND' | 'OR' 
    };
    updateConditions(updatedRoot);
  };

  // Update a specific condition within this group
  const updateChildCondition = (index: number, updated: Condition | GroupCondition) => {
    if (index < 0 || index >= safeRootCondition.conditions.length) {
      console.error('Invalid index for updateChildCondition', index);
      return;
    }
    
    const newConditions = [...safeRootCondition.conditions];
    newConditions[index] = updated;
    const updatedRoot = { ...safeRootCondition, conditions: newConditions };
    updateConditions(updatedRoot);
  };

  // Remove a condition from this group
  const removeCondition = (index: number) => {
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
  };

  // Remove this entire group
  const removeGroup = () => {
    if (parentUpdateFn) {
      parentUpdateFn(createEmptyCondition());
    }
  };

  // Calculate indentation based on nesting level
  const indentStyle = {
    marginLeft: `${level * 16}px`,
    borderLeft: level > 0 ? '2px solid #e5e7eb' : 'none',
    paddingLeft: level > 0 ? '16px' : '0'
  };

  return (
    <div className="space-y-3">
      <GroupConditionTitle 
        rootCondition={safeRootCondition}
        level={level}
        allowRemove={allowRemove}
        updateGroupLogic={updateGroupLogic}
        removeGroup={removeGroup}
      />

      <div style={indentStyle} className="space-y-3 pt-2">
        {(safeRootCondition.conditions || []).map((condition, idx) => (
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
  );
};

export default ConditionBuilder;
