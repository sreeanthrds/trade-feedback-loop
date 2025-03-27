
import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { findIndicatorUsages, UsageReference } from '../../utils/dependency-tracking/usageFinder';
import { toast } from "@/hooks/use-toast";

export function useDependencyChecking() {
  const { getNodes, setNodes } = useReactFlow();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usages, setUsages] = useState<UsageReference[]>([]);
  const [pendingIndicatorToRemove, setPendingIndicatorToRemove] = useState<string | null>(null);
  
  const checkDependenciesBeforeRemove = (indicatorName: string, onConfirmRemove: () => void) => {
    // Find usages before showing dialog
    const allNodes = getNodes();
    const foundUsages = findIndicatorUsages(indicatorName, allNodes);
    
    if (foundUsages.length > 0) {
      setUsages(foundUsages);
      setPendingIndicatorToRemove(indicatorName);
      setIsDialogOpen(true);
      return false; // Indicate that removal is pending confirmation
    } else {
      // No usages, safe to remove
      onConfirmRemove();
      return true; // Indicate that removal was performed
    }
  };
  
  const confirmRemoval = (onConfirmRemove: () => void) => {
    // Proceed with the removal
    onConfirmRemove();
    setIsDialogOpen(false);
    setPendingIndicatorToRemove(null);
  };
  
  const cancelRemoval = () => {
    setIsDialogOpen(false);
    setPendingIndicatorToRemove(null);
  };
  
  const cleanupNodeConditionsAfterRemoval = (indicatorName: string) => {
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
  
  // Helper function to recursively clean conditions that use a deleted indicator
  const cleanNodeConditionsOfIndicator = (node: any, indicatorName: string) => {
    if (!node.data.condition) return node;
    
    // Create a deep copy of the node to modify
    const updatedNode = { ...node, data: { ...node.data } };
    
    const cleanCondition = (condition: any): any => {
      if (!condition) return condition;
      
      // For group conditions, recursively clean child conditions
      if (condition.groupLogic && condition.conditions) {
        // Clean each condition in the group
        const cleanedConditions = condition.conditions
          .map(cleanCondition)
          .filter(Boolean); // Remove any null/undefined results
        
        // If no conditions left, return null (this group will be removed)
        if (cleanedConditions.length === 0) {
          return null;
        }
        
        return {
          ...condition,
          conditions: cleanedConditions
        };
      } 
      
      // For single conditions, check if indicator is used in either side
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
      
      // Also check complex expressions
      if (condition.lhs?.type === 'expression') {
        const cleanedLhs = cleanExpression(condition.lhs, indicatorName);
        if (!cleanedLhs) {
          return null;
        }
        condition = { ...condition, lhs: cleanedLhs };
      }
      
      if (condition.rhs?.type === 'expression') {
        const cleanedRhs = cleanExpression(condition.rhs, indicatorName);
        if (!cleanedRhs) {
          return null;
        }
        condition = { ...condition, rhs: cleanedRhs };
      }
      
      return condition;
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
    
    // Clean the root condition
    const cleanedCondition = cleanCondition(updatedNode.data.condition);
    
    // If the entire condition was removed, set to a default empty condition
    updatedNode.data.condition = cleanedCondition || {
      id: `group_${Math.random().toString(36).substr(2, 9)}`,
      groupLogic: 'AND',
      conditions: []
    };
    
    return updatedNode;
  };
  
  return {
    isDialogOpen,
    usages,
    pendingIndicatorToRemove,
    checkDependenciesBeforeRemove,
    confirmRemoval,
    cancelRemoval,
    cleanupNodeConditionsAfterRemoval,
    setIsDialogOpen
  };
}
