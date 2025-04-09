
import React, { useCallback, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { importStrategyFromEvent } from '../../utils/import-export/fileOperations';
import ToolbarButton from './ToolbarButton';

interface ImportButtonProps {
  setNodes: (nodes: any[]) => void;
  setEdges: (edges: any[]) => void;
  addHistoryItem: (nodes: any[], edges: any[]) => void;
  resetHistory: () => void;
  strategyId: string;
  strategyName: string;
  onImportSuccess?: () => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({ 
  setNodes, 
  setEdges, 
  addHistoryItem, 
  resetHistory,
  strategyId,
  strategyName,
  onImportSuccess
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  
  const currentStrategyIdRef = useRef(strategyId);
  const currentStrategyNameRef = useRef(strategyName);
  
  // Update refs when props change
  React.useEffect(() => {
    currentStrategyIdRef.current = strategyId;
    currentStrategyNameRef.current = strategyName;
    
    setIsImporting(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [strategyId, strategyName]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isImporting) {
      console.log("Import already in progress, ignoring");
      return;
    }
    
    if (!currentStrategyIdRef.current) {
      console.error("Cannot import without a strategy ID");
      toast({
        title: "Import failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    console.log(`Starting import process for strategy: ${currentStrategyIdRef.current} - ${currentStrategyNameRef.current}`);
    
    try {
      toast({
        title: "Importing strategy",
        description: "Please wait while we process your file..."
      });
      
      console.log(`Importing with strategy ID: ${currentStrategyIdRef.current}`);
      const result = await importStrategyFromEvent(
        event, 
        setNodes, 
        setEdges, 
        addHistoryItem, 
        resetHistory,
        currentStrategyIdRef.current,
        currentStrategyNameRef.current
      );
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (result && onImportSuccess) {
        console.log("Import was successful, calling onImportSuccess callback in 700ms");
        setTimeout(() => {
          console.log("Calling onImportSuccess callback");
          onImportSuccess();
        }, 700);
      }
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Import failed",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        console.log("Resetting importing state");
        setIsImporting(false);
      }, 1000);
    }
  }, [addHistoryItem, onImportSuccess, resetHistory, setEdges, setNodes, toast, isImporting]);

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  return (
    <>
      <ToolbarButton
        icon={Upload}
        label={isImporting ? 'Importing...' : 'Import'}
        onClick={triggerFileInput}
        disabled={isImporting}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
        disabled={isImporting}
      />
    </>
  );
};

export default ImportButton;
