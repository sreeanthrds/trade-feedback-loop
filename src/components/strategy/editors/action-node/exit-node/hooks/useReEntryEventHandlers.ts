import { Node } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { ReEntryConfig, ExitNodeData } from '../types';
import { useReEntryConfig } from './useReEntryConfig';
import { useReEntryGroupSync } from './useReEntryGroupSync';

interface UseReEntryEventHandlersProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  nodeData: any;
  defaultExitNodeData: ExitNodeData;
  reEntryEnabled: boolean;
  setReEntryEnabled: (enabled: boolean) => void;
  groupNumber: number;
  setGroupNumber: (group: number) => void;
  maxReEntries: number;
  setMaxReEntries: (max: number) => void;
}

export const useReEntryEventHandlers = ({
  node,
  updateNodeData,
  nodeData,
  defaultExitNodeData,
  reEntryEnabled,
  setReEntryEnabled,
  groupNumber,
  setGroupNumber,
  maxReEntries,
  setMaxReEntries
}: UseReEntryEventHandlersProps) => {
  // Get configuration utilities
  const { updateReEntryConfig, validateGroupNumber } = useReEntryConfig({
    node,
    updateNodeData,
    nodeData
  });
  
  // Get group syncing utilities
  const { syncWithExistingGroup, syncGroupMaxReEntries } = useReEntryGroupSync({
    node,
    updateNodeData,
    groupNumber,
    reEntryEnabled
  });
  
  // Handle re-entry toggle
  const handleReEntryToggle = (checked: boolean) => {
    setReEntryEnabled(checked);
    
    // When enabled, default to group 1 and 3 max re-entries
    const newGroupNumber = checked ? (groupNumber || 1) : 0;
    const newMaxReEntries = checked ? (maxReEntries || 3) : 0;
    
    setGroupNumber(newGroupNumber);
    setMaxReEntries(newMaxReEntries);
    
    const updatedConfig = {
      enabled: checked,
      groupNumber: newGroupNumber,
      maxReEntries: newMaxReEntries
    };
    
    updateReEntryConfig(updatedConfig, defaultExitNodeData);
  };
  
  // Handle group number change
  const handleGroupNumberChange = (value: number | undefined) => {
    // Don't allow group number 0 when enabled
    if (!validateGroupNumber(value, reEntryEnabled)) {
      toast({
        title: "Invalid group number",
        description: "Group number must be at least 1 when re-entry is enabled",
        variant: "destructive"
      });
      return;
    }
    
    const newGroupNumber = reEntryEnabled ? (value || 1) : 0;
    setGroupNumber(newGroupNumber);
    
    // If changing to a different group, check if we need to sync with that group
    if (reEntryEnabled && newGroupNumber !== groupNumber) {
      // This will return the max re-entries from the new group, or keep existing if no group exists
      const newMaxReEntries = syncWithExistingGroup(newGroupNumber, maxReEntries);
      
      if (newMaxReEntries !== maxReEntries) {
        setMaxReEntries(newMaxReEntries);
      }
      
      // Update config with potentially new max re-entries
      updateReEntryConfig({
        enabled: reEntryEnabled,
        groupNumber: newGroupNumber,
        maxReEntries: newMaxReEntries
      }, defaultExitNodeData);
    } else {
      // Just update this node's config
      updateReEntryConfig({
        enabled: reEntryEnabled,
        groupNumber: newGroupNumber,
        maxReEntries
      }, defaultExitNodeData);
    }
  };
  
  // Handle max re-entries change
  const handleMaxReEntriesChange = (value: number | undefined) => {
    // Don't allow negative values
    if (value !== undefined && value < 0) return;
    
    const newMaxReEntries = value !== undefined ? value : 0;
    setMaxReEntries(newMaxReEntries);
    
    const updatedConfig = {
      enabled: reEntryEnabled,
      groupNumber,
      maxReEntries: newMaxReEntries
    };
    
    // Update this node's config
    updateReEntryConfig(updatedConfig, defaultExitNodeData);
    
    // If part of a group, sync all nodes in the same group
    if (reEntryEnabled && groupNumber > 0) {
      syncGroupMaxReEntries(groupNumber, newMaxReEntries);
    }
  };
  
  return {
    handleReEntryToggle,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
