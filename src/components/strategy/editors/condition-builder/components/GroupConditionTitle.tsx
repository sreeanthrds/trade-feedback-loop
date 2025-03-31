
import React from 'react';
import { Group, Combine } from 'lucide-react';
import { GroupCondition } from '../../../utils/conditionTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface GroupConditionTitleProps {
  rootCondition: GroupCondition;
  level: number;
  allowRemove: boolean;
  updateGroupLogic: (value: string) => void;
  removeGroup: () => void;
}

const GroupConditionTitle: React.FC<GroupConditionTitleProps> = ({
  rootCondition,
  level,
  allowRemove,
  updateGroupLogic,
  removeGroup,
}) => {
  const isAnd = rootCondition.groupLogic === 'AND';
  const badgeClass = isAnd ? 'and-badge' : 'or-badge';
  
  return (
    <div className={`condition-group-title ${isAnd ? 'and' : 'or'}`}>
      <div className="flex items-center gap-2 flex-1">
        {level > 0 ? (
          <Combine className={`h-4 w-4 ${isAnd ? 'text-blue-500' : 'text-orange-500'}`} />
        ) : (
          <Group className={`h-4 w-4 ${isAnd ? 'text-blue-500' : 'text-orange-500'}`} />
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
        <span className={badgeClass}>
          Group with {rootCondition.conditions.length} condition{rootCondition.conditions.length !== 1 ? 's' : ''}
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
  );
};

export default GroupConditionTitle;
