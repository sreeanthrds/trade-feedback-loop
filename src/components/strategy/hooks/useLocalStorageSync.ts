
import { useEffect, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';

interface UseLocalStorageSyncProps {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  strategyStore: any;
  initialNodes: Node[];
}

export function useLocalStorageSync({
  setNodes,
  setEdges,
  strategyStore,
  initialNodes
}: UseLocalStorageSyncProps) {
  const isInitialLoadRef = useRef(true);
  const isUpdatingFromLocalStorageRef = useRef(false);
  
  // Initial load from localStorage
  useEffect(() => {
    if (!isInitialLoadRef.current || isUpdatingFromLocalStorageRef.current) {
      return; // Prevent duplicate loading
    }
    
    try {
      isUpdatingFromLocalStorageRef.current = true;
      
      // Try to load the strategy from localStorage
      const savedStrategy = localStorage.getItem('tradyStrategy');
      
      if (savedStrategy) {
        const parsed = JSON.parse(savedStrategy);
        
        if (parsed.nodes && parsed.edges) {
          console.log('Loading strategy from localStorage');
          
          // Apply nodes first
          setNodes(parsed.nodes);
          
          // Apply edges in the next cycle to prevent conflicts
          setTimeout(() => {
            setEdges(parsed.edges);
            
            // Update store in a separate cycle
            setTimeout(() => {
              strategyStore.setNodes(parsed.nodes);
              strategyStore.setEdges(parsed.edges);
              strategyStore.resetHistory();
              strategyStore.addHistoryItem(parsed.nodes, parsed.edges);
              
              console.log('Strategy loaded from localStorage successfully');
              isInitialLoadRef.current = false;
            }, 0);
          }, 0);
        } else {
          console.log('Invalid saved strategy format, using default nodes');
          setNodes(initialNodes);
          isInitialLoadRef.current = false;
        }
      } else {
        console.log('No saved strategy found, using default nodes');
        setNodes(initialNodes);
        isInitialLoadRef.current = false;
      }
    } catch (error) {
      console.error('Error loading strategy from localStorage:', error);
      setNodes(initialNodes);
      isInitialLoadRef.current = false;
      
      toast({
        title: "Error loading strategy",
        description: "Could not load your saved strategy. Starting with a new one.",
        variant: "destructive"
      });
    } finally {
      // Reset flag after a small delay
      setTimeout(() => {
        isUpdatingFromLocalStorageRef.current = false;
      }, 500);
    }
  }, [setNodes, setEdges, strategyStore, initialNodes]);

  // Listen for external changes to localStorage (from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tradyStrategy' && e.newValue) {
        try {
          // Prevent update loops by using a ref flag
          if (!isUpdatingFromLocalStorageRef.current) {
            isUpdatingFromLocalStorageRef.current = true;
            
            const parsed = JSON.parse(e.newValue);
            if (parsed.nodes && parsed.edges) {
              setNodes(parsed.nodes);
              setEdges(parsed.edges);
              
              // Update store in a separate cycle
              setTimeout(() => {
                strategyStore.setNodes(parsed.nodes);
                strategyStore.setEdges(parsed.edges);
                strategyStore.resetHistory();
                strategyStore.addHistoryItem(parsed.nodes, parsed.edges);
                
                // Reset flag after applying changes
                setTimeout(() => {
                  isUpdatingFromLocalStorageRef.current = false;
                }, 100);
              }, 100);
            }
          }
        } catch (error) {
          console.error('Error handling storage event:', error);
          isUpdatingFromLocalStorageRef.current = false;
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setNodes, setEdges, strategyStore]);

  return { isInitialLoadRef };
}
