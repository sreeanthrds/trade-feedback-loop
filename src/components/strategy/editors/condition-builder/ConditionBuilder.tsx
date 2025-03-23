
import React from 'react';
import { 
  Condition, 
  GroupCondition, 
  createEmptyCondition,
  createEmptyGroupCondition,
  groupConditionToString
} from '../../utils/conditionTypes';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Group, LogIn } from 'lucide-react';
import SingleConditionEditor from './SingleConditionEditor';

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

  // Calculate indentation based on nesting level
  const indentStyle = {
    marginLeft: `${level * 16}px`,
    borderLeft: level > 0 ? '2px solid #e5e7eb' : 'none',
    paddingLeft: level > 0 ? '16px' : '0'
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {level > 0 && (
            <Group className="h-4 w-4 text-muted-foreground" />
          )}
          <Select
            value={rootCondition.groupLogic}
            onValueChange={updateGroupLogic}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            Group with {rootCondition.conditions.length} condition(s)
          </span>
        </div>

        <div className="flex items-center gap-1">
          {allowRemove && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeGroup}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <div style={indentStyle} className="space-y-3 pt-2">
        {rootCondition.conditions.map((condition, idx) => (
          <div key={condition.id} className="relative">
            {'groupLogic' in condition ? (
              // Render nested group condition
              <ConditionBuilder
                rootCondition={condition as GroupCondition}
                updateConditions={(updated) => updateChildCondition(idx, updated)}
                level={level + 1}
                parentUpdateFn={(updated) => updateChildCondition(idx, updated)}
                allowRemove={true}
                index={idx}
              />
            ) : (
              // Render single condition
              <div className="flex items-start">
                <div className="flex-grow">
                  <SingleConditionEditor
                    condition={condition as Condition}
                    updateCondition={(updated) => updateChildCondition(idx, updated)}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeCondition(idx)} 
                  className="ml-2 h-8 w-8 p-0 mt-1"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addCondition}
            className="h-8"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Condition
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addGroup}
            className="h-8"
          >
            <Group className="h-3.5 w-3.5 mr-1" />
            Add Group
          </Button>
        </div>
      </div>

      {level === 0 && (
        <Card className="mt-4 bg-muted/40">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs font-medium">Preview</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-3">
            <div className="text-sm font-mono break-words">
              {groupConditionToString(rootCondition)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConditionBuilder;
