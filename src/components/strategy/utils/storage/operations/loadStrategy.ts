
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { StrategyData } from '../utils/strategyModel';

/**
 * Loads a strategy from localStorage
 * NOTE: This function is updated to ONLY work with specific strategy IDs
 * The 'tradyStrategy' key is no longer used
 */
export const loadStrategyFromLocalStorage = (strategyId: string): { nodes: Node[], edges: Edge[] } | null => {
  try {
    if (!strategyId) {
      console.warn('No strategy ID provided to loadStrategyFromLocalStorage');
      return null;
    }
    
    // Only load from the specific strategy key
    const strategyKey = `strategy_${strategyId}`;
    const savedStrategy = localStorage.getItem(strategyKey);
    
    if (!savedStrategy) {
      console.log(`No saved strategy found with key: ${strategyKey}`);
      return null;
    }
    
    console.log(`Loading strategy from localStorage key: ${strategyKey}`);
    const parsed = JSON.parse(savedStrategy) as StrategyData;
    
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
    if (!strategyId) {
      console.warn('No strategy ID provided to loadStrategyById');
      return null;
    }
    
    const strategyKey = `strategy_${strategyId}`;
    const savedStrategy = localStorage.getItem(strategyKey);
    
    if (!savedStrategy) {
      console.log(`No saved strategy found with key: ${strategyKey}`);
      return null;
    }
    
    console.log(`Loading strategy from localStorage key: ${strategyKey}`);
    const parsed = JSON.parse(savedStrategy) as StrategyData;
    
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
