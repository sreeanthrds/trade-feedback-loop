
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
  // Add a new single condition to this group
  const addCondition = () => {
    const newCondition = createEmptyCondition();
    const updatedRoot = { 
      ...rootCondition,
      conditions: [...rootCondition.conditions, newCondition]
    };
    updateConditions(updatedRoot);
  };

  // Add a new nested group condition
  const addGroup = () => {
    const newGroup = createEmptyGroupCondition();
    const updatedRoot = { 
      ...rootCondition,
      conditions: [...rootCondition.conditions, newGroup]
    };
    updateConditions(updatedRoot);
  };

  // Update this group's logic operator (AND/OR)
  const updateGroupLogic = (value: string) => {
    const updatedRoot = { 
      ...rootCondition,
      groupLogic: value as 'AND' | 'OR' 
    };
    updateConditions(updatedRoot);
  };

  // Update a specific condition within this group
  const updateChildCondition = (index: number, updated: Condition | GroupCondition) => {
    const newConditions = [...rootCondition.conditions];
    newConditions[index] = updated;
    const updatedRoot = { ...rootCondition, conditions: newConditions };
    updateConditions(updatedRoot);
  };

  // Remove a condition from this group
  const removeCondition = (index: number) => {
    // Don't remove the last condition
    if (rootCondition.conditions.length <= 1) {
      return;
    }
    
    const newConditions = [...rootCondition.conditions];
    newConditions.splice(index, 1);
    const updatedRoot = { ...rootCondition, conditions: newConditions };
    updateConditions(updatedRoot);
  };

  // Remove this entire group
  const removeGroup = () => {
    if (parentUpdateFn) {
      parentUpdateFn(createEmptyCondition());
    }
  };

  return (
    <div className="space-y-3">
      <GroupConditionTitle 
        rootCondition={rootCondition}
        level={level}
        allowRemove={allowRemove}
        updateGroupLogic={updateGroupLogic}
        removeGroup={removeGroup}
      />

      <div className={level > 0 ? "condition-group" : "space-y-3 pt-2"}>
        {rootCondition.conditions.map((condition, idx) => (
          <div key={condition.id} className="relative">
            <ConditionItem 
              condition={condition}
              index={idx}
              level={level}
              updateCondition={(updated) => updateChildCondition(idx, updated)}
              removeCondition={() => removeCondition(idx)}
            />
          </div>
        ))}

        <div className="condition-actions">
          <ConditionActions 
            addCondition={addCondition}
            addGroup={addGroup}
          />
        </div>
      </div>

      {level === 0 && (
        <ConditionPreview rootCondition={rootCondition} />
      )}
    </div>
  );
};

export default ConditionBuilder;
