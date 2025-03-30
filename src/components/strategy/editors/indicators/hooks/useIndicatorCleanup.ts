
import { Node } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { handleError } from '../../../utils/errorHandling';

/**
 * Helper function to recursively clean conditions that use a deleted indicator
 */
export const cleanNodeConditionsOfIndicator = (node: any, indicatorName: string) => {
  if (!node?.data?.conditions) return node;
  
  // Create a deep copy of the node to modify
  const updatedNode = { ...node, data: { ...node.data } };
  
  const cleanCondition = (condition: any): any => {
    if (!condition) return condition;
    
    // For group conditions, recursively clean child conditions
    if (condition.groupLogic && Array.isArray(condition.conditions)) {
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
  
  try {
    // Clean each condition
    const cleanedConditions = updatedNode.data.conditions.map(cleanCondition).filter(Boolean);
    
    // Update the node data with cleaned conditions
    updatedNode.data.conditions = cleanedConditions.length > 0 
      ? cleanedConditions
      : [{ 
          id: `group_${Math.random().toString(36).substr(2, 9)}`,
          groupLogic: 'AND',
          conditions: []
        }];
    
    return updatedNode;
  } catch (error) {
    handleError(error, 'cleanNodeConditionsOfIndicator');
    return node; // Return original node if cleaning fails
  }
};

/**
 * Updates nodes to remove references to a deleted indicator
 */
export const updateNodesAfterIndicatorRemoval = (
  nodes: Node[], 
  indicatorName: string,
  setNodes: (nodes: Node[]) => void
) => {
  if (!nodes || !Array.isArray(nodes) || !indicatorName || typeof setNodes !== 'function') {
    return;
  }
  
  try {
    // Create a new array with updated nodes
    const updatedNodes = [...nodes].map(node => {
      if (node?.type === 'signalNode' && node.data && Array.isArray(node.data.conditions)) {
        return cleanNodeConditionsOfIndicator(node, indicatorName);
      }
      return node;
    });
    
    // Only update if there were changes
    if (JSON.stringify(updatedNodes) !== JSON.stringify(nodes)) {
      setNodes(updatedNodes);
    }
  } catch (error) {
    handleError(error, 'updateNodesAfterIndicatorRemoval');
  }
};
