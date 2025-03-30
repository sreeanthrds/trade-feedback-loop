
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
  
  // Optimize the lookup by caching node types
  const relevantNodes = nodes.filter(node => node && node.type === 'signalNode' && node.data && Array.isArray(node.data.conditions));
  
  for (const node of relevantNodes) {
    // Check if conditions exist and the indicator is used
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
  
  return usages;
}

/**
 * Find all uses of an instrument/symbol
 */
export function findInstrumentUsages(symbol: string, nodes: Node[]): UsageReference[] {
  if (!symbol || !nodes || !Array.isArray(nodes)) {
    return [];
  }
  
  const usages: UsageReference[] = [];
  
  // Only check relevant node types that can reference instruments
  const relevantNodes = nodes.filter(node => 
    node && (node.type === 'entryNode' || node.type === 'exitNode' || node.type === 'actionNode')
  );
  
  for (const node of relevantNodes) {
    if (!node.data) continue;
    
    // Check for symbol in node data
    if (node.data.symbol === symbol) {
      usages.push({
        nodeId: node.id,
        nodeName: node.data.label ? String(node.data.label) : node.type,
        nodeType: node.type,
        context: 'Instrument configuration'
      });
    }
    
    // Check for symbol in positions
    if (Array.isArray(node.data.positions)) {
      const hasSymbolInPositions = node.data.positions.some((pos: any) => pos.symbol === symbol);
      
      if (hasSymbolInPositions) {
        usages.push({
          nodeId: node.id,
          nodeName: node.data.label ? String(node.data.label) : node.type,
          nodeType: node.type,
          context: 'Position configuration'
        });
      }
    }
  }
  
  return usages;
}
