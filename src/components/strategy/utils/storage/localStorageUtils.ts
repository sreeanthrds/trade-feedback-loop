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

/**
 * Saves the current strategy to localStorage with ID and name
 */
export const saveStrategyToLocalStorage = (
  nodes: Node[], 
  edges: Edge[], 
  strategyId?: string, 
  strategyName?: string
) => {
  // Cancel any pending save operations
  if (saveTimeout !== null) {
    window.clearTimeout(saveTimeout);
  }
  
  // If a save is already in progress, defer this save
  if (saveInProgress) {
    saveTimeout = window.setTimeout(() => {
      saveStrategyToLocalStorage(nodes, edges, strategyId, strategyName);
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
      
      // First save the current working strategy
      const currentStrategy = { nodes: sanitizedNodes, edges: sanitizedEdges };
      localStorage.setItem('tradyStrategy', JSON.stringify(currentStrategy));
      
      // If ID and name are provided, save to strategies list
      if (strategyId && strategyName) {
        // Save the strategy with its ID and metadata
        const strategyData = {
          id: strategyId,
          name: strategyName,
          nodes: sanitizedNodes,
          edges: sanitizedEdges,
          lastModified: new Date().toISOString(),
          created: localStorage.getItem(`strategy_${strategyId}_created`) || new Date().toISOString()
        };
        
        // Save the creation date if it's the first time
        if (!localStorage.getItem(`strategy_${strategyId}_created`)) {
          localStorage.setItem(`strategy_${strategyId}_created`, strategyData.created);
        }
        
        // Save the strategy with its ID
        localStorage.setItem(`strategy_${strategyId}`, JSON.stringify(strategyData));
        
        // Update strategies list
        let strategies = [];
        try {
          const savedStrategiesList = localStorage.getItem('strategies');
          strategies = savedStrategiesList ? JSON.parse(savedStrategiesList) : [];
        } catch (e) {
          console.error('Failed to parse strategies list:', e);
          strategies = [];
        }
        
        // Check if strategy already exists in the list
        const existingIndex = strategies.findIndex((s: any) => s.id === strategyId);
        if (existingIndex >= 0) {
          // Update existing strategy metadata
          strategies[existingIndex] = {
            id: strategyId,
            name: strategyName,
            lastModified: strategyData.lastModified,
            created: strategyData.created,
            description: strategies[existingIndex].description || "Trading strategy created with Trady"
          };
        } else {
          // Add new strategy to list
          strategies.push({
            id: strategyId,
            name: strategyName,
            lastModified: strategyData.lastModified,
            created: strategyData.created,
            description: "Trading strategy created with Trady"
          });
        }
        
        // Save updated strategies list
        localStorage.setItem('strategies', JSON.stringify(strategies));
      }
      
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
  }, 1000); // Reduced debounce time for faster feedback
};

/**
 * Loads a strategy from localStorage
 */
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

/**
 * Loads a specific strategy by ID
 */
export const loadStrategyById = (strategyId: string): { nodes: Node[], edges: Edge[], name: string } | null => {
  try {
    const savedStrategy = localStorage.getItem(`strategy_${strategyId}`);
    if (!savedStrategy) {
      return null;
    }
    
    const parsed = JSON.parse(savedStrategy);
    
    // Validate the structure before returning
    if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges) && parsed.name) {
      return {
        nodes: parsed.nodes,
        edges: parsed.edges,
        name: parsed.name
      };
    } else {
      console.warn('Invalid strategy structure in localStorage');
      return null;
    }
  } catch (error) {
    console.error(`Failed to load strategy ${strategyId}:`, error);
    toast.error("Failed to load strategy");
    return null;
  }
};

/**
 * Gets list of all saved strategies
 */
export const getStrategiesList = () => {
  try {
    const savedStrategies = localStorage.getItem('strategies');
    return savedStrategies ? JSON.parse(savedStrategies) : [];
  } catch (error) {
    console.error('Failed to load strategies list:', error);
    return [];
  }
};

/**
 * Deletes a strategy by ID
 */
export const deleteStrategy = (strategyId: string) => {
  try {
    // Remove strategy data
    localStorage.removeItem(`strategy_${strategyId}`);
    
    // Update strategies list
    const savedStrategiesList = localStorage.getItem('strategies');
    if (savedStrategiesList) {
      const strategies = JSON.parse(savedStrategiesList);
      const updatedStrategies = strategies.filter((s: any) => s.id !== strategyId);
      localStorage.setItem('strategies', JSON.stringify(updatedStrategies));
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete strategy ${strategyId}:`, error);
    return false;
  }
};
