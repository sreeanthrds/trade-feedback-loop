
/**
 * Performance utilities for efficient comparison and updates
 */

// Simple shallow equality check for objects
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

// Quick comparison for node positions
export const arePositionsEqual = (pos1: {x: number, y: number}, pos2: {x: number, y: number}): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

// Fast shallow comparison for nodes (checking only essential properties)
export const fastNodeComparison = (node1: any, node2: any): boolean => {
  if (node1 === node2) return true;
  if (!node1 || !node2) return false;
  
  // Check ID and position first (most common changes)
  if (node1.id !== node2.id) return false;
  if (!arePositionsEqual(node1.position, node2.position)) return false;
  
  // Check data with shallow comparison
  if (!shallowEqual(node1.data, node2.data)) return false;
  
  // For other properties, do a basic check
  if (node1.type !== node2.type) return false;
  if (node1.style !== node2.style && !shallowEqual(node1.style, node2.style)) return false;
  
  return true;
};

// Efficient array comparison using fast node comparison
export const fastNodesComparison = (nodes1: any[], nodes2: any[]): boolean => {
  if (nodes1 === nodes2) return true;
  if (!nodes1 || !nodes2) return false;
  if (nodes1.length !== nodes2.length) return false;
  
  // Only check a sample of nodes for very large arrays
  const nodesToCheck = nodes1.length > 30 ? 10 : nodes1.length;
  
  for (let i = 0; i < nodesToCheck; i++) {
    const index = nodes1.length > 30 ? 
      Math.floor(Math.random() * nodes1.length) : 
      i;
    
    if (!fastNodeComparison(nodes1[index], nodes2[index])) {
      return false;
    }
  }
  
  return true;
};
