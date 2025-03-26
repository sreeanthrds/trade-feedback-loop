import { Node } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { getIndicatorDisplayName } from '../indicatorUtils';
import { isIndicatorParameters } from '../indicatorUtils';

type StrategyData = {
  nodes: Node[];
  edges: any[];
  name: string;
  description: string;
  active: boolean;
};

/**
 * Exports strategy data to a JSON file
 */
export const exportStrategyData = (data: StrategyData) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.name.replace(/ /g, "_") || 'strategy'}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Imports strategy data from a JSON file
 */
export const importStrategyData = (
  file: File,
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: any[]) => void,
  setName: (name: string) => void,
  setDescription: (description: string) => void,
  setActive: (active: boolean) => void,
) => {
  const reader = new FileReader();
  
  reader.onload = (event: ProgressEvent<FileReader>) => {
    try {
      const result = event.target?.result;
      if (typeof result === 'string') {
        const strategyData = JSON.parse(result) as StrategyData;
        
        // Check if strategyData is valid
        if (strategyData && Array.isArray(strategyData.nodes) && Array.isArray(strategyData.edges)) {
          setNodes(strategyData.nodes);
          setEdges(strategyData.edges);
          setName(strategyData.name || '');
          setDescription(strategyData.description || '');
          setActive(strategyData.active || false);
          
          toast({
            title: "Strategy Imported",
            description: "Strategy data has been successfully imported.",
          });
        } else {
          toast({
            title: "Import Failed",
            description: "The imported file does not contain valid strategy data.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error importing strategy:", error);
      toast({
        title: "Import Error",
        description: "Failed to import strategy data. Please ensure the file is a valid JSON.",
        variant: "destructive",
      });
    }
  };
  
  reader.readAsText(file);
};
