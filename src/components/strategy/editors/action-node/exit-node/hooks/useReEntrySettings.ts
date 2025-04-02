
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ReEntryConfig, ExitNodeData } from '../types';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { toast } from "@/hooks/use-toast";

interface UseReEntrySettingsProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  nodeData: any;
  defaultExitNodeData: ExitNodeData;
}

export const useReEntrySettings = ({
  node,
  updateNodeData,
  nodeData,
  defaultExitNodeData
}: UseReEntrySettingsProps) => {
  // Get all nodes for group syncing
  const allNodes = useStrategyStore(state => state.nodes);
  
  // Get or initialize re-entry config
  const exitNodeData = nodeData.exitNodeData as ExitNodeData | undefined;
  const initialReEntryConfig = exitNodeData?.reEntryConfig || {
    enabled: false,
    groupNumber: 0,
    maxReEntries: 0
  };
  
  // State for re-entry settings
  const [reEntryEnabled, setReEntryEnabled] = useState<boolean>(
    initialReEntryConfig.enabled || false
  );
  
  const [groupNumber, setGroupNumber] = useState<number>(
    initialReEntryConfig.groupNumber || 0
  );
  
  const [maxReEntries, setMaxReEntries] = useState<number>(
    initialReEntryConfig.maxReEntries || 0
  );
  
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
    
    updateReEntryConfig(updatedConfig);
  };
  
  // Handle group number change
  const handleGroupNumberChange = (value: number | undefined) => {
    // Don't allow group number 0 when enabled
    if (reEntryEnabled && (!value || value < 1)) {
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
      syncWithExistingGroup(newGroupNumber);
    } else {
      // Just update this node's config
      updateReEntryConfig({
        enabled: reEntryEnabled,
        groupNumber: newGroupNumber,
        maxReEntries
      });
    }
  };
  
  // Handle max re-entries change
  const handleMaxReEntriesChange = (value: number | undefined) => {
    // Don't allow negative values
    if (value !== undefined && value < 0) return;
    
    const newMaxReEntries = value || 0;
    setMaxReEntries(newMaxReEntries);
    
    const updatedConfig = {
      enabled: reEntryEnabled,
      groupNumber,
      maxReEntries: newMaxReEntries
    };
    
    // Update this node's config
    updateReEntryConfig(updatedConfig);
    
    // If part of a group, sync all nodes in the same group
    if (reEntryEnabled && groupNumber > 0) {
      syncGroupMaxReEntries(groupNumber, newMaxReEntries);
    }
  };
  
  // Update the re-entry config in the node data
  const updateReEntryConfig = (config: ReEntryConfig) => {
    // Get the latest exit node data or use default
    const currentExitNodeData = nodeData.exitNodeData || defaultExitNodeData;
    
    // Create updated exit node data with new re-entry config
    const updatedExitNodeData = {
      ...currentExitNodeData,
      reEntryConfig: config
    };
    
    // Update the node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData,
      _lastUpdated: Date.now()
    });
  };
  
  // Sync with existing group if changing to a group that already exists
  const syncWithExistingGroup = (newGroupNumber: number) => {
    if (newGroupNumber <= 0) return;
    
    // Find all exit nodes with the same group number
    const nodesInSameGroup = allNodes.filter(n => {
      if (n.type !== 'exitNode' || n.id === node.id) return false;
      const exitNodeData = n.data?.exitNodeData as ExitNodeData | undefined;
      return exitNodeData?.reEntryConfig?.enabled &&
             exitNodeData?.reEntryConfig?.groupNumber === newGroupNumber;
    });
    
    // If there are nodes in the same group, sync max re-entries with them
    if (nodesInSameGroup.length > 0) {
      const firstNodeData = nodesInSameGroup[0].data?.exitNodeData as ExitNodeData | undefined;
      const existingMaxReEntries = firstNodeData?.reEntryConfig?.maxReEntries || 3;
      
      setMaxReEntries(existingMaxReEntries);
      
      const updatedConfig = {
        enabled: reEntryEnabled,
        groupNumber: newGroupNumber,
        maxReEntries: existingMaxReEntries
      };
      
      updateReEntryConfig(updatedConfig);
    } else {
      // Just update this node's group number
      updateReEntryConfig({
        enabled: reEntryEnabled,
        groupNumber: newGroupNumber,
        maxReEntries
      });
    }
  };
  
  // Sync all nodes in the same group when max re-entries changes
  const syncGroupMaxReEntries = (group: number, newMaxReEntries: number) => {
    if (group <= 0) return;
    
    // Find all exit nodes with the same group number
    const nodesInSameGroup = allNodes.filter(n => {
      if (n.type !== 'exitNode' || n.id === node.id) return false;
      const exitNodeData = n.data?.exitNodeData as ExitNodeData | undefined;
      return exitNodeData?.reEntryConfig?.enabled &&
             exitNodeData?.reEntryConfig?.groupNumber === group;
    });
    
    // Update all nodes in the same group
    nodesInSameGroup.forEach(otherNode => {
      const otherNodeData = otherNode.data || {};
      const otherExitNodeData = otherNodeData.exitNodeData as ExitNodeData | undefined || {};
      const otherReEntryConfig = otherExitNodeData.reEntryConfig || {};
      
      const updatedConfig = {
        ...otherReEntryConfig,
        maxReEntries: newMaxReEntries
      };
      
      const updatedExitNodeData = {
        ...otherExitNodeData,
        reEntryConfig: updatedConfig
      };
      
      updateNodeData(otherNode.id, {
        ...otherNodeData,
        exitNodeData: updatedExitNodeData,
        _lastUpdated: Date.now()
      });
    });
  };
  
  // Check for group sync from other nodes when nodes change
  useEffect(() => {
    if (!reEntryEnabled || groupNumber <= 0) return;
    
    // Find all exit nodes with the same group number
    const nodesInSameGroup = allNodes.filter(n => {
      if (n.type !== 'exitNode' || n.id === node.id) return false;
      const exitNodeData = n.data?.exitNodeData as ExitNodeData | undefined;
      return exitNodeData?.reEntryConfig?.enabled &&
             exitNodeData?.reEntryConfig?.groupNumber === groupNumber;
    });
    
    // If there are nodes in the same group, check if max re-entries needs updating
    if (nodesInSameGroup.length > 0) {
      const sortedNodes = [...nodesInSameGroup].sort((a, b) => {
        const lastUpdatedA = a.data?._lastUpdated as number || 0;
        const lastUpdatedB = b.data?._lastUpdated as number || 0;
        return lastUpdatedB - lastUpdatedA;
      });
      
      const latestNodeInGroup = sortedNodes[0];
      const latestNodeData = latestNodeInGroup.data?.exitNodeData as ExitNodeData | undefined;
      const latestMaxReEntries = latestNodeData?.reEntryConfig?.maxReEntries;
      
      // Only update if the values are different
      if (latestMaxReEntries !== undefined && latestMaxReEntries !== maxReEntries) {
        setMaxReEntries(latestMaxReEntries);
      }
    }
  }, [allNodes, groupNumber, reEntryEnabled, maxReEntries, node.id]);
  
  return {
    reEntryEnabled,
    groupNumber,
    maxReEntries,
    handleReEntryToggle,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  };
};
