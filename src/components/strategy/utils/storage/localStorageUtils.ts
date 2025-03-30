
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

// Track if a save operation is in progress to avoid parallel operations
let saveInProgress = false;

// Create a debounced version of save to prevent excessive writes
let saveTimeout: number | null = null;

/**
 * Sanitize the strategy data before saving to remove circular references
 * and any properties that might cause issues with serialization
 * Optimized for better performance with selective property checking
 */
const sanitizeForStorage = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }
  
  // Handle basic types
  if (typeof data !== 'object') {
    return data;
  }
  
  // Handle arrays more efficiently
  if (Array.isArray(data)) {
    // For large arrays, limit processing depth to improve performance
    if (data.length > 100) {
      // Process only a subset of large arrays (first 50, then every 5th, then last 50)
      const sanitized = [];
      
      // First 50
      for (let i = 0; i < Math.min(50, data.length); i++) {
        sanitized.push(sanitizeForStorage(data[i]));
      }
      
      // Middle (sample every 5th)
      if (data.length > 100) {
        for (let i = 50; i < data.length - 50; i += 5) {
          sanitized.push(sanitizeForStorage(data[i]));
        }
      }
      
      // Last 50
      for (let i = Math.max(50, data.length - 50); i < data.length; i++) {
        sanitized.push(sanitizeForStorage(data[i]));
      }
      
      return sanitized;
    }
    
    return data.map(item => sanitizeForStorage(item));
  }
  
  // Handle objects - more efficiently
  const sanitized = {};
  
  // Skip known problematic properties upfront
  const skipProps = new Set([
    '__proto__', '_owner', 'ref', 'parent', 'internals', 
    'initializer', 'handlers', '_reactEvents'
  ]);
  
  for (const key in data) {
    // Skip internal properties, functions, and known problematic properties
    if (
      !data.hasOwnProperty(key) ||
      skipProps.has(key) || 
      key.startsWith('__') || 
      typeof data[key] === 'function'
    ) {
      continue;
    }
    
    // Recursively sanitize
    try {
      sanitized[key] = sanitizeForStorage(data[key]);
    } catch (err) {
      // Skip problematic properties
    }
  }
  
  return sanitized;
};

export const saveStrategyToLocalStorage = (nodes: Node[], edges: Edge[]) => {
  // Cancel any pending save operations
  if (saveTimeout !== null) {
    window.clearTimeout(saveTimeout);
  }
  
  // If a save is already in progress, defer this save
  if (saveInProgress) {
    saveTimeout = window.setTimeout(() => {
      saveStrategyToLocalStorage(nodes, edges);
    }, 1000);
    return;
  }
  
  // Debounce the save operation
  saveTimeout = window.setTimeout(() => {
    saveInProgress = true;
    
    try {
      // Only save if we have valid nodes and edges
      if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        console.warn('Invalid nodes or edges provided to saveStrategyToLocalStorage');
        return;
      }
      
      // Optimize nodes before saving to reduce size
      const optimizedNodes = nodes.map(node => {
        // Remove empty node data objects
        if (node.data && Object.keys(node.data).length === 0) {
          return { ...node, data: null };
        }
        
        // For signal nodes with many conditions, simplify to reduce storage size
        if (node.type === 'signalNode' && 
            node.data && 
            Array.isArray(node.data.conditions) && 
            node.data.conditions.length > 20) {
          // Deep clone to avoid modifying original
          const simplifiedNode = { ...node, data: { ...node.data } };
          
          // Limit conditions to improve serialization performance
          simplifiedNode.data.conditions = [...node.data.conditions.slice(0, 20)];
          
          return simplifiedNode;
        }
        
        return node;
      });
      
      // Sanitize to remove circular references
      const sanitizedNodes = sanitizeForStorage(optimizedNodes);
      const sanitizedEdges = sanitizeForStorage(edges);
      
      const strategy = { nodes: sanitizedNodes, edges: sanitizedEdges };
      
      // Use more efficient serialization
      const serialized = JSON.stringify(strategy);
      
      localStorage.setItem('tradyStrategy', serialized);
      
      toast.success("Strategy saved successfully", {
        duration: 2000,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Failed to save strategy:', error);
      toast.error("Failed to save strategy");
    } finally {
      saveInProgress = false;
      saveTimeout = null;
    }
  }, 2000); // Increased debounce time for less frequent saves
};

export const loadStrategyFromLocalStorage = (): { nodes: Node[], edges: Edge[] } | null => {
  try {
    const savedStrategy = localStorage.getItem('tradyStrategy');
    if (!savedStrategy) {
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
