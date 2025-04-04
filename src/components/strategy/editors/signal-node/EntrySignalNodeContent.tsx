
import React from 'react';
import { GroupCondition } from '../../utils/conditionTypes';
import ConditionBuilder from '../condition-builder/ConditionBuilder';

interface EntrySignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (conditions: GroupCondition[]) => void;
}

const EntrySignalNodeContent = ({ conditions, updateConditions }: EntrySignalNodeContentProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Entry Conditions</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Define the conditions that will trigger entry signals for your strategy.
        </p>
        
        <ConditionBuilder 
          rootCondition={conditions[0]}
          updateConditions={(updatedRoot) => updateConditions([updatedRoot])}
          rootGroupId="entry-root"
          conditionContext="entry"
        />
      </div>
    </div>
  );
};

export default EntrySignalNodeContent;
