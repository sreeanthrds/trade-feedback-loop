
import React, { memo } from 'react';
import { Condition, GroupCondition } from '../../../utils/conditions';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import SingleConditionEditor from '../SingleConditionEditor';
import ConditionBuilder from '../ConditionBuilder';
import { Card, CardContent } from '@/components/ui/card';

interface ConditionItemProps {
  condition: Condition | GroupCondition;
  index: number;
  level: number;
  updateCondition: (updated: Condition | GroupCondition) => void;
  removeCondition: () => void;
  conditionContext?: 'entry' | 'exit';
}

const ConditionItem: React.FC<ConditionItemProps> = ({
  condition,
  index,
  level,
  updateCondition,
  removeCondition,
  conditionContext = 'entry'
}) => {
  if ('groupLogic' in condition) {
    // Render nested group condition
    return (
      <ConditionBuilder
        rootCondition={condition as GroupCondition}
        updateConditions={(updated) => updateCondition(updated)}
        level={level + 1}
        parentUpdateFn={(updated) => updateCondition(updated)}
        allowRemove={true}
        index={index}
        context={conditionContext}
      />
    );
  } else {
    // Render single condition
    return (
      <Card className="mb-3 bg-muted/40 border-border w-full overflow-visible">
        <CardContent className="p-3 flex items-start overflow-visible">
          <div className="flex-grow overflow-visible">
            <SingleConditionEditor
              condition={condition as Condition}
              updateCondition={(updated) => updateCondition(updated)}
              conditionContext={conditionContext}
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={removeCondition} 
            className="ml-2 h-8 w-8 p-0 mt-1 shrink-0"
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        </CardContent>
      </Card>
    );
  }
};

// Use memo to prevent unnecessary re-renders
export default memo(ConditionItem);
