
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData, ReEntryConfig, PostExecutionConfig } from '../types';

interface UseReEntryConfigProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  defaultExitNodeData: ExitNodeData;
  feature: 'stopLoss' | 'trailingStop' | 'takeProfit';
}

export const useReEntryConfig = ({
  node,
  updateNodeData,
  defaultExitNodeData,
  feature
}: UseReEntryConfigProps) => {
  // Get current exit node data or use default
  const getCurrentExitNodeData = useCallback(() => {
    return (node.data?.exitNodeData as ExitNodeData) || defaultExitNodeData;
  }, [node.data, defaultExitNodeData]);

  // Handle updates to re-entry settings for a specific feature
  const handleReEntryUpdates = useCallback((updates: Partial<ReEntryConfig>) => {
    const currentExitNodeData = getCurrentExitNodeData();
    const postExecutionConfig = currentExitNodeData.postExecutionConfig || defaultExitNodeData.postExecutionConfig || {};
    const featureConfig = postExecutionConfig?.[feature] || { enabled: false };
    
    // Initialize reEntry if it doesn't exist
    const currentReEntry = featureConfig.reEntry || { enabled: false, groupNumber: 1, maxReEntries: 1 };
    
    // Update the re-entry config
    const updatedFeatureConfig = {
      ...featureConfig,
      reEntry: {
        ...currentReEntry,
        ...updates
      }
    };
    
    // Create updated config
    const updatedPostExecutionConfig = {
      ...postExecutionConfig,
      [feature]: updatedFeatureConfig
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...node.data,
      exitNodeData: {
        ...currentExitNodeData,
        postExecutionConfig: updatedPostExecutionConfig
      }
    });
  }, [node, updateNodeData, getCurrentExitNodeData, defaultExitNodeData, feature]);

  return {
    handleReEntryUpdates,
  };
};
