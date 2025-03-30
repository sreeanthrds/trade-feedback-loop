
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
    
    // Skip large or problematic objects that aren't needed for serialization
    if (
      key === 'internals' ||
      key === 'initializer' ||
      key === 'handlers'
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

// Create a debounced version of save to prevent excessive writes
let saveTimeout: number | null = null;

export const saveStrategyToLocalStorage = (nodes: Node[], edges: Edge[]) => {
  // Cancel any pending save operations
  if (saveTimeout !== null) {
    window.clearTimeout(saveTimeout);
  }
  
  // Debounce the save operation
  saveTimeout = window.setTimeout(() => {
    try {
      // Only save if we have valid nodes and edges
      if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        console.warn('Invalid nodes or edges provided to saveStrategyToLocalStorage');
        return;
      }
      
      // Remove empty node data objects to reduce size
      const optimizedNodes = nodes.map(node => {
        if (node.data && Object.keys(node.data).length === 0) {
          return { ...node, data: null };
        }
        return node;
      });
      
      // Sanitize to remove circular references
      const sanitizedNodes = sanitizeForStorage(optimizedNodes);
      const sanitizedEdges = sanitizeForStorage(edges);
      
      const strategy = { nodes: sanitizedNodes, edges: sanitizedEdges };
      
      // Use more efficient serialization if available
      const serialized = JSON.stringify(strategy);
      
      // Compress large strategies if possible
      if (serialized.length > 500000 && typeof CompressionStream !== 'undefined') {
        // For now, just proceed with regular storage
        localStorage.setItem('tradyStrategy', serialized);
      } else {
        localStorage.setItem('tradyStrategy', serialized);
      }
      
      toast.success("Strategy saved successfully");
    } catch (error) {
      console.error('Failed to save strategy:', error);
      toast.error("Failed to save strategy");
    }
    
    saveTimeout = null;
  }, 300); // Debounce for 300ms
};

export const loadStrategyFromLocalStorage = (): { nodes: Node[], edges: Edge[] } | null => {
  try {
    const savedStrategy = localStorage.getItem('tradyStrategy');
    if (!savedStrategy) {
      return null;
    }
    
    // Check if the strategy is compressed (for future use)
    if (savedStrategy.startsWith('compressed:')) {
      // For now, handle uncompressed only
      return null;
    }
    
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
  } catch (error) {
    console.error('Failed to load strategy:', error);
    toast.error("Failed to load saved strategy");
    return null;
  }
};
