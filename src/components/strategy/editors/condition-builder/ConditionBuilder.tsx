
import React, { memo, useCallback } from 'react';
import { 
  Condition, 
  GroupCondition, 
  createEmptyCondition,
  createEmptyGroupCondition
} from '../../utils/conditions';
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
  conditionContext?: 'entry' | 'exit';
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  rootCondition,
  updateConditions,
  level = 0,
  parentUpdateFn,
  allowRemove = false,
  index = 0,
  conditionContext = 'entry'
}) => {
  // Use useCallback to prevent recreating functions on each render
  const addCondition = useCallback(() => {
    const newCondition = createEmptyCondition();
    const updatedRoot = { 
      ...rootCondition,
      conditions: [...rootCondition.conditions, newCondition]
    };
    updateConditions(updatedRoot);
  }, [rootCondition, updateConditions]);

  // Use useCallback for addGroup
  const addGroup = useCallback(() => {
    const newGroup = createEmptyGroupCondition();
    const updatedRoot = { 
      ...rootCondition,
      conditions: [...rootCondition.conditions, newGroup]
    };
    updateConditions(updatedRoot);
  }, [rootCondition, updateConditions]);

  // Use useCallback for updateGroupLogic
  const updateGroupLogic = useCallback((value: string) => {
    const updatedRoot = { 
      ...rootCondition,
      groupLogic: value as 'AND' | 'OR' 
    };
    updateConditions(updatedRoot);
  }, [rootCondition, updateConditions]);

  // Use useCallback for updateChildCondition
  const updateChildCondition = useCallback((index: number, updated: Condition | GroupCondition) => {
    const newConditions = [...rootCondition.conditions];
    newConditions[index] = updated;
    const updatedRoot = { ...rootCondition, conditions: newConditions };
    updateConditions(updatedRoot);
  }, [rootCondition, updateConditions]);

  // Use useCallback for removeCondition
  const removeCondition = useCallback((index: number) => {
    // Don't remove the last condition
    if (rootCondition.conditions.length <= 1) {
      return;
    }
    
    const newConditions = [...rootCondition.conditions];
    newConditions.splice(index, 1);
    const updatedRoot = { ...rootCondition, conditions: newConditions };
    updateConditions(updatedRoot);
  }, [rootCondition, updateConditions]);

  // Use useCallback for removeGroup
  const removeGroup = useCallback(() => {
    if (parentUpdateFn) {
      parentUpdateFn(createEmptyCondition());
    }
  }, [parentUpdateFn]);

  // Determine the CSS class based on the context
  const contextClass = conditionContext === 'exit' ? 'exit-condition-builder' : 'entry-condition-builder';

  return (
    <div className={`space-y-3 ${level > 0 ? 'condition-group' : ''} ${contextClass}`}>
      <GroupConditionTitle 
        rootCondition={rootCondition}
        level={level}
        allowRemove={allowRemove}
        updateGroupLogic={updateGroupLogic}
        removeGroup={removeGroup}
      />

      <div className={`space-y-3 ${level > 0 ? 'indent-level-' + level : ''}`}>
        {rootCondition.conditions.map((condition, idx) => (
          <div key={condition.id} className="relative">
            <ConditionItem 
              condition={condition}
              index={idx}
              level={level}
              updateCondition={(updated) => updateChildCondition(idx, updated)}
              removeCondition={() => removeCondition(idx)}
              conditionContext={conditionContext}
            />
          </div>
        ))}

        <ConditionActions 
          addCondition={addCondition}
          addGroup={addGroup}
        />
      </div>

      {level === 0 && (
        <ConditionPreview 
          rootCondition={rootCondition} 
          contextLabel={conditionContext === 'exit' ? 'Exit when:' : 'Enter when:'}
        />
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(ConditionBuilder);
