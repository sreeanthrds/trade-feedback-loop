
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
 * The format matches the exported JSON file format
 */
export const saveStrategyToLocalStorage = (
  nodes: Node[], 
  edges: Edge[], 
  strategyId?: string, 
  strategyName?: string
) => {
  // Generate a unique ID if this is a new strategy
  const finalStrategyId = strategyId || `strategy-${Date.now()}`;
  const finalStrategyName = strategyName || "Untitled Strategy";
  
  // Cancel any pending save operations
  if (saveTimeout !== null) {
    window.clearTimeout(saveTimeout);
  }
  
  // If a save is already in progress, defer this save
  if (saveInProgress) {
    saveTimeout = window.setTimeout(() => {
      saveStrategyToLocalStorage(nodes, edges, finalStrategyId, finalStrategyName);
    }, 1000);
    return;
  }
  
  console.log(`Saving strategy: ${finalStrategyId} - ${finalStrategyName}`);
  
  // Debounce the save operation
  saveTimeout = window.setTimeout(() => {
    saveInProgress = true;
    
    try {
      // Only save if we have valid nodes and edges
      if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        console.warn('Invalid nodes or edges provided to saveStrategyToLocalStorage');
        return;
      }
      
      // Sanitize to remove circular references
      const sanitizedNodes = sanitizeForStorage(nodes);
      const sanitizedEdges = sanitizeForStorage(edges);
      
      // Create the complete strategy object (matches export format)
      const strategyData = {
        nodes: sanitizedNodes,
        edges: sanitizedEdges,
        id: finalStrategyId,
        name: finalStrategyName,
        lastModified: new Date().toISOString(),
        created: localStorage.getItem(`strategy_${finalStrategyId}_created`) || new Date().toISOString(),
        description: "Trading strategy created with Trady"
      };
      
      // Save the creation date if it's the first time
      if (!localStorage.getItem(`strategy_${finalStrategyId}_created`)) {
        localStorage.setItem(`strategy_${finalStrategyId}_created`, strategyData.created);
      }
      
      // Save the complete strategy with its ID
      localStorage.setItem(`strategy_${finalStrategyId}`, JSON.stringify(strategyData));
      console.log(`Saved complete strategy to localStorage: strategy_${finalStrategyId}`);
      
      // Also save as the current working strategy
      localStorage.setItem('tradyStrategy', JSON.stringify(strategyData));
      console.log('Saved current working strategy to localStorage');
      
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
      const existingIndex = strategies.findIndex((s: any) => s.id === finalStrategyId);
      if (existingIndex >= 0) {
        // Update existing strategy metadata
        strategies[existingIndex] = {
          id: finalStrategyId,
          name: finalStrategyName,
          lastModified: strategyData.lastModified,
          created: strategyData.created,
          description: strategies[existingIndex].description || "Trading strategy created with Trady"
        };
        console.log(`Updated existing strategy in list at index ${existingIndex}`);
      } else {
        // Add new strategy to list
        strategies.push({
          id: finalStrategyId,
          name: finalStrategyName,
          lastModified: strategyData.lastModified,
          created: strategyData.created,
          description: "Trading strategy created with Trady"
        });
        console.log(`Added new strategy to list, now contains ${strategies.length} strategies`);
      }
      
      // Save updated strategies list
      localStorage.setItem('strategies', JSON.stringify(strategies));
      console.log('Saved updated strategies list to localStorage');
      
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
  }, 500); // Reduced debounce time for faster feedback
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
    const strategies = savedStrategies ? JSON.parse(savedStrategies) : [];
    console.log(`Retrieved ${strategies.length} strategies from localStorage`);
    return strategies;
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
    localStorage.removeItem(`strategy_${strategyId}_created`);
    
    // Update strategies list
    const savedStrategiesList = localStorage.getItem('strategies');
    if (savedStrategiesList) {
      const strategies = JSON.parse(savedStrategiesList);
      const updatedStrategies = strategies.filter((s: any) => s.id !== strategyId);
      localStorage.setItem('strategies', JSON.stringify(updatedStrategies));
      console.log(`Deleted strategy ${strategyId}, updated list has ${updatedStrategies.length} strategies`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete strategy ${strategyId}:`, error);
    return false;
  }
};
