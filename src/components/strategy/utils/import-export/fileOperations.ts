
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';

/**
 * Export the current strategy to a JSON file
 */
export const exportStrategyToFile = (nodes: Node[], edges: Edge[]) => {
  try {
    // Prepare the data to export
    const dataToExport = {
      nodes,
      edges,
      version: '1.0.0', // Adding a version can help with future compatibility
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(dataToExport, null, 2);
    
    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    
    // Set the filename
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    downloadLink.download = `strategy-${formattedDate}.json`;
    
    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Strategy exported",
      description: "Your strategy has been exported successfully."
    });
  } catch (error) {
    console.error('Error exporting strategy:', error);
    toast({
      title: "Export failed",
      description: "Failed to export your strategy. Please try again.",
      variant: "destructive"
    });
  }
};

/**
 * Import a strategy from a file upload event
 */
export const importStrategyFromEvent = (
  event: React.ChangeEvent<HTMLInputElement>,
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  onSuccess?: () => void
) => {
  try {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a strategy file to import.",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Basic validation
        if (!importedData.nodes || !Array.isArray(importedData.nodes)) {
          throw new Error('Invalid strategy file: missing nodes array');
        }
        
        // Set the imported nodes and edges
        setNodes(importedData.nodes);
        setEdges(importedData.edges || []);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        toast({
          title: "Strategy imported",
          description: "Your strategy has been imported successfully."
        });
      } catch (parseError) {
        console.error('Error parsing strategy file:', parseError);
        toast({
          title: "Import failed",
          description: "The selected file is not a valid strategy file.",
          variant: "destructive"
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Import failed",
        description: "Failed to read the selected file. Please try again.",
        variant: "destructive"
      });
    };
    
    reader.readAsText(file);
  } catch (error) {
    console.error('Error importing strategy:', error);
    toast({
      title: "Import failed",
      description: "An unexpected error occurred during import.",
      variant: "destructive"
    });
  } finally {
    // Reset the input element to allow reimporting the same file
    if (event.target) {
      event.target.value = '';
    }
  }
};
