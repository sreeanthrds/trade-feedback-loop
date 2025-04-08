
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { StrategyData } from '../utils/strategyModel';

/**
 * Loads a strategy from localStorage
 */
export const loadStrategyFromLocalStorage = (): { nodes: Node[], edges: Edge[] } | null => {
  try {
    const savedStrategy = localStorage.getItem('tradyStrategy');
    if (!savedStrategy) {
      return null;
    }
    
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
    const savedStrategy = localStorage.getItem(`strategy_${strategyId}`);
    if (!savedStrategy) {
      return null;
    }
    
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
