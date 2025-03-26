
import React from 'react';
import { GroupCondition, groupConditionToString } from '../../../utils/conditionTypes';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { AlertTriangle } from 'lucide-react';

interface ConditionPreviewProps {
  rootCondition: GroupCondition;
}

const ConditionPreview: React.FC<ConditionPreviewProps> = ({
  rootCondition,
}) => {
  const strategyStore = useStrategyStore();
  
  // Get the start node to access indicator parameters
  const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
  
  // Handle the case where rootCondition is null or undefined
  if (!rootCondition) {
    return (
      <Card className="mt-4 bg-muted/40">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-xs font-medium">Preview</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3">
          <div className="text-sm font-mono text-muted-foreground">
            No conditions defined
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Check if we have any conditions to display
  const hasConditions = Array.isArray(rootCondition.conditions) && 
    rootCondition.conditions.length > 0 && 
    rootCondition.conditions.some(c => c !== undefined);
  
  if (!hasConditions) {
    return (
      <Card className="mt-4 bg-muted/40">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-xs font-medium">Preview</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3">
          <div className="text-sm font-mono text-muted-foreground">
            No conditions defined
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Try to format the condition, but handle errors gracefully
  let formattedCondition: string;
  try {
    formattedCondition = groupConditionToString(rootCondition, startNode?.data);
  } catch (error) {
    console.error("Error formatting condition:", error);
    return (
      <Card className="mt-4 bg-muted/40">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-xs font-medium">Preview</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3">
          <div className="flex items-center gap-1 text-destructive">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs">Error formatting condition</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-4 bg-muted/40">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-xs font-medium">Preview</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <div className="text-sm font-mono break-words">
          {formattedCondition}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionPreview;
