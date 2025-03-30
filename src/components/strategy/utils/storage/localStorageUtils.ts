
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

/**
 * Sanitize the strategy data before saving to remove circular references
 * and any properties that might cause issues with serialization
 */
const sanitizeForStorage = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }
  
  // Handle basic types
  if (typeof data !== 'object') {
    return data;
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForStorage(item));
  }
  
  // Handle objects
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    // Skip react-specific props and functions
    if (
      key.startsWith('__') || 
      key === '_owner' || 
      key === 'ref' || 
      key === 'parent' ||
      typeof value === 'function'
    ) {
      continue;
    }
    
    // Recursively sanitize
    try {
      sanitized[key] = sanitizeForStorage(value);
    } catch (err) {
      console.warn(`Error sanitizing ${key}:`, err);
      // Skip problematic properties
    }
  }
  
  return sanitized;
};

export const saveStrategyToLocalStorage = (nodes: Node[], edges: Edge[]) => {
  try {
    // Sanitize to remove circular references
    const sanitizedNodes = sanitizeForStorage(nodes);
    const sanitizedEdges = sanitizeForStorage(edges);
    
    const strategy = { nodes: sanitizedNodes, edges: sanitizedEdges };
    localStorage.setItem('tradyStrategy', JSON.stringify(strategy));
    toast.success("Strategy saved successfully");
  } catch (error) {
    console.error('Failed to save strategy:', error);
    toast.error("Failed to save strategy");
  }
};

export const loadStrategyFromLocalStorage = (): { nodes: Node[], edges: Edge[] } | null => {
  try {
    const savedStrategy = localStorage.getItem('tradyStrategy');
    if (savedStrategy) {
      const parsed = JSON.parse(savedStrategy);
      
      // Validate the structure before returning
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        return {
          nodes: parsed.nodes,
          edges: parsed.edges
        };
      } else {
        console.warn('Invalid strategy structure in localStorage');
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to load strategy:', error);
    toast.error("Failed to load saved strategy");
    return null;
  }
};
