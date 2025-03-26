
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { GroupCondition, createEmptyGroupCondition } from '../../utils/conditionTypes';
import ConditionBuilder from '../condition-builder/ConditionBuilder';
import { useToast } from '@/hooks/use-toast';

interface SignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (conditions: GroupCondition[]) => void;
}

const SignalNodeContent: React.FC<SignalNodeContentProps> = ({ 
  conditions, 
  updateConditions
}) => {
  const { toast } = useToast();
  const [hasError, setHasError] = useState(false);

  // Try to safely process conditions, handle errors gracefully
  const safeConditions = React.useMemo(() => {
    try {
      setHasError(false);
      
      if (!Array.isArray(conditions)) {
        return [createEmptyGroupCondition()];
      }
      
      if (conditions.length === 0) {
        return [createEmptyGroupCondition()];
      }
      
      return conditions.map(condition => {
        if (!condition) {
          return createEmptyGroupCondition();
        }
        return condition;
      });
    } catch (error) {
      console.error("Error processing conditions:", error);
      setHasError(true);
      return [createEmptyGroupCondition()];
    }
  }, [conditions]);
  
  const handleAddConditionGroup = () => {
    try {
      const newConditions = [...safeConditions, createEmptyGroupCondition()];
      updateConditions(newConditions);
    } catch (error) {
      console.error("Error adding condition group:", error);
      toast({
        title: "Error adding condition group",
        description: "Something went wrong while adding a condition group.",
        variant: "destructive"
      });
    }
  };

  const updateConditionGroup = (index: number, updatedGroup: GroupCondition) => {
    try {
      if (index < 0 || index >= safeConditions.length) {
        console.error('Invalid index for updating condition group', index);
        return;
      }
      
      const newConditions = [...safeConditions];
      newConditions[index] = updatedGroup;
      updateConditions(newConditions);
    } catch (error) {
      console.error("Error updating condition group:", error);
      toast({
        title: "Error updating condition",
        description: "Something went wrong while updating a condition.",
        variant: "destructive"
      });
    }
  };

  const removeConditionGroup = (index: number) => {
    try {
      // Don't allow removing the last group
      if (safeConditions.length <= 1) {
        return;
      }
      
      const newConditions = safeConditions.filter((_, i) => i !== index);
      updateConditions(newConditions);
    } catch (error) {
      console.error("Error removing condition group:", error);
      toast({
        title: "Error removing condition group", 
        description: "Something went wrong while removing a condition group.",
        variant: "destructive"
      });
    }
  };

  // If we encountered an error processing conditions, show an error state
  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="text-sm font-medium mb-2">Signal Conditions</div>
        <div className="flex items-center justify-center flex-col gap-2 p-4 border border-destructive/30 bg-destructive/10 rounded-md">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive font-medium">Error in conditions</p>
          <p className="text-xs text-muted-foreground text-center mb-2">
            There was an error processing the conditions for this signal.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConditions([createEmptyGroupCondition()])}
          >
            Reset Conditions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm font-medium mb-2">Signal Conditions</div>
      
      <div className="space-y-4">
        {safeConditions.map((condition, index) => (
          <ConditionBuilder
            key={condition?.id || `group-${index}`}
            rootCondition={condition || createEmptyGroupCondition()}
            updateConditions={(updated) => updateConditionGroup(index, updated)}
            allowRemove={safeConditions.length > 1}
            parentUpdateFn={() => removeConditionGroup(index)}
          />
        ))}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleAddConditionGroup}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Condition Group
      </Button>
    </div>
  );
};

export default SignalNodeContent;
