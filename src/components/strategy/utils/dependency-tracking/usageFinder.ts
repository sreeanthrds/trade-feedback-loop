
import { Node, Edge } from '@xyflow/react';

export interface UsageReference {
  nodeId: string;
  nodeName: string; // Display name of the node
  nodeType: string;
  context: string; // Where in the node it's used (e.g., "condition", "action")
}

/**
 * Finds all usage references for a specific indicator
 * @param indicator The indicator key to search for (e.g. "EMA_1")
 * @param nodes All nodes in the flow
 * @returns Array of usage references
 */
export function findIndicatorUsages(indicator: string, nodes: Node[]): UsageReference[] {
  const usages: UsageReference[] = [];
  
  for (const node of nodes) {
    // Skip the start node itself
    if (node.type === 'startNode') continue;
    
    // Check signal nodes for indicator usage in conditions
    if (node.type === 'signalNode' && node.data) {
      if (node.data.condition) {
        // Find any conditions using this indicator
        const hasIndicatorInCondition = searchConditionForIndicator(
          node.data.condition, 
          indicator
        );
        
        if (hasIndicatorInCondition) {
          usages.push({
            nodeId: node.id,
            nodeName: node.data.label ? String(node.data.label) : 'Signal Node', // Fix: Ensure string type
            nodeType: 'signalNode',
            context: 'Signal condition'
          });
        }
      }
    }
  }
  
  return usages;
}

/**
 * Recursively searches through conditions for an indicator
 */
function searchConditionForIndicator(condition: any, indicatorName: string): boolean {
  if (!condition) return false;
  
  // Group conditions
  if (condition.groupLogic && condition.conditions) {
    for (const subCondition of condition.conditions) {
      if (searchConditionForIndicator(subCondition, indicatorName)) {
        return true;
      }
    }
    return false;
  }
  
  // Single condition with lhs/rhs
  if (condition.lhs || condition.rhs) {
    // Check left-hand side expression
    if (condition.lhs?.type === 'indicator' && condition.lhs?.name === indicatorName) {
      return true;
    }
    
    // Check right-hand side expression
    if (condition.rhs?.type === 'indicator' && condition.rhs?.name === indicatorName) {
      return true;
    }
    
    // Check for complex expressions
    if (condition.lhs?.type === 'expression') {
      if (searchExpressionForIndicator(condition.lhs, indicatorName)) {
        return true;
      }
    }
    
    if (condition.rhs?.type === 'expression') {
      if (searchExpressionForIndicator(condition.rhs, indicatorName)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Search for indicator usage in complex expressions
 */
function searchExpressionForIndicator(expression: any, indicatorName: string): boolean {
  if (!expression) return false;
  
  // Direct indicator match
  if (expression.type === 'indicator' && expression.name === indicatorName) {
    return true;
  }
  
  // Check nested expressions (left and right sides)
  if (expression.type === 'expression') {
    return searchExpressionForIndicator(expression.left, indicatorName) || 
           searchExpressionForIndicator(expression.right, indicatorName);
  }
  
  return false;
}

/**
 * Finds all usage references for a specific instrument
 * @param symbol The instrument symbol to search for
 * @param nodes All nodes in the flow
 * @returns Array of usage references
 */
export function findInstrumentUsages(symbol: string, nodes: Node[]): UsageReference[] {
  const usages: UsageReference[] = [];
  
  for (const node of nodes) {
    // Skip the start node itself
    if (node.type === 'startNode') continue;
    
    // Check action nodes using instrument
    if (node.type === 'actionNode' && node.data) {
      if (node.data.instrument === symbol) {
        usages.push({
          nodeId: node.id,
          nodeName: node.data.label ? String(node.data.label) : 'Action Node', // Fix: Ensure string type
          nodeType: 'actionNode',
          context: 'Trading instrument'
        });
      }
    }
  }
  
  return usages;
}
