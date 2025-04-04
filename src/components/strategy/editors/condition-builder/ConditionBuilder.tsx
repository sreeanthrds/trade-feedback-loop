
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
  rootCondition?: GroupCondition;
  conditions?: GroupCondition[];
  setConditions?: (conditions: GroupCondition[]) => void;
  updateConditions?: (updatedCondition: GroupCondition) => void;
  level?: number;
  parentUpdateFn?: (updated: GroupCondition | Condition) => void;
  allowRemove?: boolean;
  index?: number;
  conditionContext?: 'entry' | 'exit';
  rootGroupId?: string;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  rootCondition,
  conditions,
  setConditions,
  updateConditions,
  level = 0,
  parentUpdateFn,
  allowRemove = false,
  index = 0,
  conditionContext = 'entry',
  rootGroupId
}) => {
  // Handle legacy API using conditions array
  const effectiveRootCondition = rootCondition || 
    (conditions && conditions.length > 0 ? conditions[0] : createEmptyGroupCondition(rootGroupId || 'root'));
  
  const effectiveUpdateFn = updateConditions || 
    (setConditions ? (updatedRoot: GroupCondition) => {
      // If using the legacy array API, replace the first condition
      if (setConditions && conditions) {
        const newConditions = [...conditions];
        newConditions[0] = updatedRoot;
        setConditions(newConditions);
      }
    } : () => {});

  // Use useCallback to prevent recreating functions on each render
  const addCondition = useCallback(() => {
    const newCondition = createEmptyCondition();
    const updatedRoot = { 
      ...effectiveRootCondition,
      conditions: [...effectiveRootCondition.conditions, newCondition]
    };
    effectiveUpdateFn(updatedRoot);
  }, [effectiveRootCondition, effectiveUpdateFn]);

  // Use useCallback for addGroup
  const addGroup = useCallback(() => {
    const newGroup = createEmptyGroupCondition();
    const updatedRoot = { 
      ...effectiveRootCondition,
      conditions: [...effectiveRootCondition.conditions, newGroup]
    };
    effectiveUpdateFn(updatedRoot);
  }, [effectiveRootCondition, effectiveUpdateFn]);

  // Use useCallback for updateGroupLogic
  const updateGroupLogic = useCallback((value: string) => {
    const updatedRoot = { 
      ...effectiveRootCondition,
      groupLogic: value as 'AND' | 'OR' 
    };
    effectiveUpdateFn(updatedRoot);
  }, [effectiveRootCondition, effectiveUpdateFn]);

  // Use useCallback for updateChildCondition
  const updateChildCondition = useCallback((index: number, updated: Condition | GroupCondition) => {
    const newConditions = [...effectiveRootCondition.conditions];
    newConditions[index] = updated;
    const updatedRoot = { ...effectiveRootCondition, conditions: newConditions };
    effectiveUpdateFn(updatedRoot);
  }, [effectiveRootCondition, effectiveUpdateFn]);

  // Use useCallback for removeCondition
  const removeCondition = useCallback((index: number) => {
    // Don't remove the last condition
    if (effectiveRootCondition.conditions.length <= 1) {
      return;
    }
    
    const newConditions = [...effectiveRootCondition.conditions];
    newConditions.splice(index, 1);
    const updatedRoot = { ...effectiveRootCondition, conditions: newConditions };
    effectiveUpdateFn(updatedRoot);
  }, [effectiveRootCondition, effectiveUpdateFn]);

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
        rootCondition={effectiveRootCondition}
        level={level}
        allowRemove={allowRemove}
        updateGroupLogic={updateGroupLogic}
        removeGroup={removeGroup}
      />

      <div className={`space-y-3 ${level > 0 ? 'indent-level-' + level : ''}`}>
        {effectiveRootCondition.conditions.map((condition, idx) => (
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
          rootCondition={effectiveRootCondition} 
          contextLabel={conditionContext === 'exit' ? 'Exit when:' : 'Enter when:'}
        />
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(ConditionBuilder);
