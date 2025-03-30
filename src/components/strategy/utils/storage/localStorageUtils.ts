
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';

/**
 * Save the current strategy to localStorage
 */
export const saveStrategyToLocalStorage = (nodes: Node[], edges: Edge[]) => {
  try {
    localStorage.setItem('strategy-nodes', JSON.stringify(nodes));
    localStorage.setItem('strategy-edges', JSON.stringify(edges));
  } catch (error) {
    console.error('Error saving strategy to localStorage:', error);
    toast({
      title: "Error saving strategy",
      description: "Could not save your strategy locally. Your browser storage may be full.",
      variant: "destructive"
    });
  }
};

/**
 * Load strategy from localStorage
 */
export const loadStrategyFromLocalStorage = (): { nodes: Node[], edges: Edge[] } | null => {
  try {
    const nodesJson = localStorage.getItem('strategy-nodes');
    const edgesJson = localStorage.getItem('strategy-edges');
    
    if (nodesJson) {
      const nodes = JSON.parse(nodesJson);
      const edges = edgesJson ? JSON.parse(edgesJson) : [];
      return { nodes, edges };
    }
  } catch (error) {
    console.error('Error loading strategy from localStorage:', error);
    toast({
      title: "Error loading strategy",
      description: "Could not load your saved strategy. The format may be incompatible.",
      variant: "destructive"
    });
  }
  
  return null;
};
