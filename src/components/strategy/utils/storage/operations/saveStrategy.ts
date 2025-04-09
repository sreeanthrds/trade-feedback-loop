
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { sanitizeForStorage } from '../utils/sanitizeUtils';
import { createStrategyObject, StrategyData } from '../utils/strategyModel';

// Track if a save operation is in progress to avoid parallel operations
let saveInProgress = false;

// Create a debounced version of save to prevent excessive writes
let saveTimeout: number | null = null;

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
        saveInProgress = false;
        saveTimeout = null;
        return;
      }
      
      // Sanitize to remove circular references
      const sanitizedNodes = sanitizeForStorage(nodes);
      const sanitizedEdges = sanitizeForStorage(edges);
      
      // Get existing creation date if available
      const existingCreationDate = localStorage.getItem(`strategy_${finalStrategyId}_created`);
      
      // Create the complete strategy object (matches export format)
      const strategyData = createStrategyObject(
        sanitizedNodes, 
        sanitizedEdges, 
        finalStrategyId, 
        finalStrategyName,
        existingCreationDate
      );
      
      // Save the creation date if it's the first time
      if (!existingCreationDate) {
        localStorage.setItem(`strategy_${finalStrategyId}_created`, strategyData.created);
      }
      
      // First: save the specific strategy with its ID
      localStorage.setItem(`strategy_${finalStrategyId}`, JSON.stringify(strategyData));
      console.log(`Saved dedicated strategy to localStorage: strategy_${finalStrategyId}`);
      
      // Second: save as the current working strategy (only if this is the current strategy)
      // Check if there's an existing working strategy with a different ID
      const existingWorkingStrategy = localStorage.getItem('tradyStrategy');
      let shouldSetWorkingStrategy = true;
      
      if (existingWorkingStrategy) {
        try {
          const parsedExisting = JSON.parse(existingWorkingStrategy);
          // Only replace if it's the same ID or there's no ID in the existing
          if (parsedExisting.id && parsedExisting.id !== finalStrategyId) {
            console.log(`Not overwriting working strategy with ID ${parsedExisting.id}`);
            shouldSetWorkingStrategy = false;
          }
        } catch (e) {
          console.error("Error parsing existing working strategy:", e);
        }
      }
      
      if (shouldSetWorkingStrategy) {
        localStorage.setItem('tradyStrategy', JSON.stringify(strategyData));
        console.log(`Saved current working strategy to localStorage for ID: ${finalStrategyId}`);
      }
      
      // Update strategies list
      updateStrategiesList(strategyData);
      
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
 * Update the strategies list in localStorage
 */
const updateStrategiesList = (strategyData: StrategyData) => {
  let strategies = [];
  try {
    const savedStrategiesList = localStorage.getItem('strategies');
    if (savedStrategiesList) {
      try {
        strategies = JSON.parse(savedStrategiesList);
      } catch (e) {
        console.error('Failed to parse strategies list:', e);
        strategies = [];
      }
    }
  } catch (e) {
    console.error('Failed to get strategies list:', e);
    strategies = [];
  }
  
  // Extract metadata for the strategies list
  const strategyMetadata = {
    id: strategyData.id,
    name: strategyData.name,
    lastModified: strategyData.lastModified,
    created: strategyData.created,
    description: strategyData.description
  };
  
  // Check if strategy already exists in the list
  const existingIndex = strategies.findIndex((s: any) => s.id === strategyData.id);
  if (existingIndex >= 0) {
    // Update existing strategy metadata
    strategies[existingIndex] = strategyMetadata;
    console.log(`Updated existing strategy in list at index ${existingIndex}`);
  } else {
    // Add new strategy to list
    strategies.push(strategyMetadata);
    console.log(`Added new strategy to list, now contains ${strategies.length} strategies`);
  }
  
  // Save updated strategies list
  localStorage.setItem('strategies', JSON.stringify(strategies));
  console.log('Saved updated strategies list to localStorage');
};
