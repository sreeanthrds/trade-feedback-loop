
import { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

export const saveStrategyToLocalStorage = (nodes: Node[], edges: Edge[]) => {
  const strategy = { nodes, edges };
  localStorage.setItem('tradyStrategy', JSON.stringify(strategy));
  toast.success("Strategy saved successfully");
};

export const loadStrategyFromLocalStorage = (): { nodes: Node[], edges: Edge[] } | null => {
  const savedStrategy = localStorage.getItem('tradyStrategy');
  if (savedStrategy) {
    try {
      return JSON.parse(savedStrategy);
    } catch (error) {
      console.error('Failed to load strategy:', error);
      return null;
    }
  }
  return null;
};
