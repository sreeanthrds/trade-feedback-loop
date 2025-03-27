
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
      if (node.data.conditions && Array.isArray(node.data.conditions)) {
        // Find any conditions using this indicator
        const hasIndicatorInCondition = searchConditionsForIndicator(
          node.data.conditions, 
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
function searchConditionsForIndicator(conditions: any[], indicatorName: string): boolean {
  for (const condition of conditions) {
    // Group conditions
    if (condition.type === 'group' && condition.children) {
      if (searchConditionsForIndicator(condition.children, indicatorName)) {
        return true;
      }
    }
    // Single condition with expressions
    else if (condition.expressions) {
      for (const expr of [condition.left, condition.right]) {
        if (!expr) continue;
        
        if (expr.type === 'indicator' && expr.name === indicatorName) {
          return true;
        }
        // For complex expressions that might contain nested indicator references
        else if (expr.type === 'expression' && expr.expressions) {
          const leftHasIndicator = expr.expressions.left?.type === 'indicator' && 
                                  expr.expressions.left?.name === indicatorName;
          
          const rightHasIndicator = expr.expressions.right?.type === 'indicator' && 
                                   expr.expressions.right?.name === indicatorName;
          
          if (leftHasIndicator || rightHasIndicator) {
            return true;
          }
        }
      }
    }
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
