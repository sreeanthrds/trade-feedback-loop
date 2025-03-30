
import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { findIndicatorUsages, UsageReference } from '../../../utils/dependency-tracking/usageFinder';

export interface UseIndicatorManagementProps {
  selectedIndicators: Record<string, Record<string, any>>;
  onChange: (indicators: Record<string, Record<string, any>>) => void;
}

export const useIndicatorManagement = ({ 
  selectedIndicators, 
  onChange 
}: UseIndicatorManagementProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>("");
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const { getNodes, setNodes } = useReactFlow();
  
  const generateUniqueIndicatorKey = (baseIndicatorName: string): string => {
    let uniqueKey = baseIndicatorName;
    let counter = 1;
    
    while (selectedIndicators[uniqueKey]) {
      uniqueKey = `${baseIndicatorName}_${counter}`;
      counter++;
    }
    
    return uniqueKey;
  };
  
  const handleAddIndicator = (newIndicator: any) => {
    if (!selectedIndicator) return;
    
    const defaultValues = createDefaultValues(newIndicator);
    const baseIndicatorName = selectedIndicator;
    const uniqueKey = generateUniqueIndicatorKey(baseIndicatorName);
    
    const updatedIndicators = {
      ...selectedIndicators,
      [uniqueKey]: defaultValues
    };
    
    onChange(updatedIndicators);
    
    setOpenStates({
      ...openStates,
      [uniqueKey]: true
    });
    
    setSelectedIndicator("");
    
    toast({
      title: "Indicator added",
      description: `Added ${baseIndicatorName} indicator`
    });
  };
  
  const createDefaultValues = (indicator: any): Record<string, any> => {
    return indicator.parameters.reduce((acc: Record<string, any>, param: any) => {
      acc[param.name] = param.default;
      return acc;
    }, {});
  };
  
  const handleRemoveIndicator = (indicatorName: string) => {
    // Create a new object without the deleted indicator
    const { [indicatorName]: removed, ...rest } = selectedIndicators;
    
    // Update indicator parameters in start node
    onChange(rest);
    
    // Update nodes that are using this indicator
    updateNodesAfterIndicatorRemoval(indicatorName);
    
    toast({
      title: "Indicator removed",
      description: `Removed ${indicatorName.split('_')[0]} indicator`
    });
  };
  
  const updateNodesAfterIndicatorRemoval = (indicatorName: string) => {
    const allNodes = getNodes();
    
    const updatedNodes = allNodes.map(node => {
      if (node.type === 'signalNode' && node.data && node.data.condition) {
        // Clean up signal node conditions that use this indicator
        const cleanedNode = cleanNodeConditionsOfIndicator(node, indicatorName);
        return cleanedNode;
      }
      return node;
    });
    
    // Update nodes if any changes were made
    if (JSON.stringify(allNodes) !== JSON.stringify(updatedNodes)) {
      setNodes(updatedNodes);
    }
  };
  
  const handleParameterChange = (indicatorName: string, paramName: string, value: any) => {
    const updatedIndicators = {
      ...selectedIndicators,
      [indicatorName]: {
        ...selectedIndicators[indicatorName],
        [paramName]: value
      }
    };
    
    onChange(updatedIndicators);
  };
  
  const toggleOpen = (indicatorName: string) => {
    setOpenStates({
      ...openStates,
      [indicatorName]: !openStates[indicatorName]
    });
  };

  const findUsages = (indicatorName: string): UsageReference[] => {
    const allNodes = getNodes();
    return findIndicatorUsages(indicatorName, allNodes);
  };

  return {
    selectedIndicator,
    openStates,
    setSelectedIndicator,
    handleAddIndicator,
    handleRemoveIndicator,
    handleParameterChange,
    toggleOpen,
    findUsages
  };
};

// Process a single condition in the recursive cleaning process
const processSingleCondition = (condition: any, indicatorName: string): any => {
  // Check if indicator is used in either side
  const lhsUsesDeletedIndicator = 
    condition.lhs?.type === 'indicator' && 
    condition.lhs?.name === indicatorName;
    
  const rhsUsesDeletedIndicator = 
    condition.rhs?.type === 'indicator' && 
    condition.rhs?.name === indicatorName;
  
  // If this condition uses the deleted indicator, remove it
  if (lhsUsesDeletedIndicator || rhsUsesDeletedIndicator) {
    return null;
  }
  
  // Check complex expressions
  let updatedCondition = { ...condition };
  
  if (condition.lhs?.type === 'expression') {
    const cleanedLhs = cleanExpression(condition.lhs, indicatorName);
    if (!cleanedLhs) {
      return null;
    }
    updatedCondition = { ...updatedCondition, lhs: cleanedLhs };
  }
  
  if (condition.rhs?.type === 'expression') {
    const cleanedRhs = cleanExpression(condition.rhs, indicatorName);
    if (!cleanedRhs) {
      return null;
    }
    updatedCondition = { ...updatedCondition, rhs: cleanedRhs };
  }
  
  return updatedCondition;
};

// Process a group condition in the recursive cleaning process
const processGroupCondition = (condition: any, indicatorName: string): any => {
  if (!condition.groupLogic || !condition.conditions) {
    return condition;
  }
  
  // Clean each condition in the group
  const cleanedConditions = condition.conditions
    .map((subCondition: any) => cleanCondition(subCondition, indicatorName))
    .filter(Boolean); // Remove any null/undefined results
  
  // If no conditions left, return null (this group will be removed)
  if (cleanedConditions.length === 0) {
    return null;
  }
  
  return {
    ...condition,
    conditions: cleanedConditions
  };
};

// Clean condition recursively
const cleanCondition = (condition: any, indicatorName: string): any => {
  if (!condition) return condition;
  
  // For group conditions, recursively clean child conditions
  if (condition.groupLogic && condition.conditions) {
    return processGroupCondition(condition, indicatorName);
  } 
  
  // For single conditions, process them
  return processSingleCondition(condition, indicatorName);
};

// Helper to clean expressions
const cleanExpression = (expr: any, indicatorName: string): any => {
  if (!expr) return expr;
  
  // Check if this expression directly uses the indicator
  if (expr.type === 'indicator' && expr.name === indicatorName) {
    return null;
  }
  
  // For complex expressions, check both sides
  if (expr.type === 'expression') {
    const cleanedLeft = cleanExpression(expr.left, indicatorName);
    const cleanedRight = cleanExpression(expr.right, indicatorName);
    
    // If either side is null, the expression is invalid
    if (!cleanedLeft || !cleanedRight) {
      return null;
    }
    
    return {
      ...expr,
      left: cleanedLeft,
      right: cleanedRight
    };
  }
  
  return expr;
};

// Helper function to recursively clean conditions that use a deleted indicator
const cleanNodeConditionsOfIndicator = (node: any, indicatorName: string) => {
  if (!node.data.condition) return node;
  
  // Create a deep copy of the node to modify
  const updatedNode = { ...node, data: { ...node.data } };
  
  // Clean the root condition
  const cleanedCondition = cleanCondition(updatedNode.data.condition, indicatorName);
  
  // If the entire condition was removed, set to a default empty condition
  updatedNode.data.condition = cleanedCondition || {
    id: `group_${Math.random().toString(36).substr(2, 9)}`,
    groupLogic: 'AND',
    conditions: []
  };
  
  return updatedNode;
};
