
import React from 'react';
import { Condition, GroupCondition } from '../../../utils/conditionTypes';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import SingleConditionEditor from '../SingleConditionEditor';
import ConditionBuilder from '../ConditionBuilder';
import { Card, CardContent } from '@/components/ui/card';

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
      />
    );
  } else {
    // Render single condition
    return (
      <Card className="mb-3 bg-muted/40 border-border w-full">
        <CardContent className="p-3 flex items-start overflow-visible">
          <div className="flex-grow min-w-0 overflow-visible">
            <SingleConditionEditor
              condition={condition as Condition}
              updateCondition={(updated) => updateCondition(updated)}
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={removeCondition} 
            className="ml-2 h-8 w-8 p-0 mt-1 shrink-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </CardContent>
      </Card>
    );
  }
};

export default ConditionItem;
