
/**
 * Utility for finding usage references
 */

import { Node } from '@xyflow/react';
import { UsageReference } from './types';
import { searchConditionsForIndicator } from './indicatorUsage';

/**
 * Finds all usage references for a specific indicator
 * @param indicator The indicator key to search for (e.g. "EMA_1")
 * @param nodes All nodes in the flow
 * @returns Array of usage references
 */
export function findIndicatorUsages(indicator: string, nodes: Node[]): UsageReference[] {
  if (!indicator || !nodes || !Array.isArray(nodes)) {
    return [];
  }
  
  const usages: UsageReference[] = [];
  
  for (const node of nodes) {
    // Skip the start node itself
    if (!node || node.type === 'startNode') continue;
    
    // Check signal nodes for indicator usage in conditions
    if (node.type === 'signalNode' && node.data) {
      // Check if conditions exists and is an array
      if (Array.isArray(node.data.conditions)) {
        // Find any conditions using this indicator
        const hasIndicatorInCondition = searchConditionsForIndicator(
          node.data.conditions, 
          indicator
        );
        
        if (hasIndicatorInCondition) {
          usages.push({
            nodeId: node.id,
            nodeName: node.data.label ? String(node.data.label) : 'Signal Node',
            nodeType: 'signalNode',
            context: 'Signal condition'
          });
        }
      }
    }
  }
  
  return usages;
}
