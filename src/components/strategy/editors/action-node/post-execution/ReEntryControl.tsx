
import React, { useEffect } from 'react';
import EnhancedSwitch from '@/components/ui/form/enhanced/EnhancedSwitch';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { ExitNodeData } from '../exit-node/types';

interface ReEntryConfig {
  enabled: boolean;
  groupNumber: number;
  maxReEntries: number;
}

interface ReEntryControlProps {
  id: string;
  reEntry: ReEntryConfig;
  onToggle: (enabled: boolean) => void;
  onReEntryUpdate: (updates: Partial<{ groupNumber: number; maxReEntries: number }>) => void;
}

const ReEntryControl: React.FC<ReEntryControlProps> = ({
  id,
  reEntry,
  onToggle,
  onReEntryUpdate
}) => {
  const nodes = useStrategyStore(state => state.nodes);
  
  // Calculate the next available group number when creating a new group
  const getNextAvailableGroupNumber = (): number => {
    const allGroupNumbers = new Set<number>();
    
    // Collect all existing group numbers from exit nodes
    nodes.forEach(n => {
      if (n.type === 'exitNode') {
        const nData = n.data as { exitNodeData?: ExitNodeData };
        if (nData.exitNodeData?.reEntryConfig?.enabled && 
            nData.exitNodeData?.reEntryConfig?.groupNumber !== undefined) {
          allGroupNumbers.add(nData.exitNodeData.reEntryConfig.groupNumber);
        }
      } else if (n.type === 'retryNode') {
        const nData = n.data as { retryConfig?: { groupNumber?: number } };
        if (nData.retryConfig?.groupNumber !== undefined) {
          allGroupNumbers.add(nData.retryConfig.groupNumber);
        }
      }
    });
    
    // Find the first unused group number
    let groupNumber = 1;
    while (allGroupNumbers.has(groupNumber)) {
      groupNumber++;
    }
    
    return groupNumber;
  };
  
  // Sync with existing nodes when group number changes
  useEffect(() => {
    if (!reEntry.enabled) return;
    
    const currentGroup = reEntry.groupNumber;
    
    // Find existing nodes in the same group
    const existingGroupNodes = nodes.filter(n => {
      if (n.id === id) return false; // Skip current node
      
      if (n.type === 'exitNode') {
        const nData = n.data as { exitNodeData?: ExitNodeData };
        return nData.exitNodeData?.reEntryConfig?.enabled && 
               nData.exitNodeData?.reEntryConfig?.groupNumber === currentGroup;
      } else if (n.type === 'retryNode') {
        const nData = n.data as { retryConfig?: { groupNumber?: number } };
        return nData.retryConfig?.groupNumber === currentGroup;
      }
      return false;
    });
    
    // If joining an existing group, adopt its maxReEntries
    if (existingGroupNodes.length > 0) {
      const firstNode = existingGroupNodes[0];
      let existingMaxReEntries: number | undefined;
      
      if (firstNode.type === 'exitNode') {
        const nData = firstNode.data as { exitNodeData?: ExitNodeData };
        existingMaxReEntries = nData.exitNodeData?.reEntryConfig?.maxReEntries;
      } else if (firstNode.type === 'retryNode') {
        const nData = firstNode.data as { retryConfig?: { maxReEntries?: number } };
        existingMaxReEntries = nData.retryConfig?.maxReEntries;
      }
      
      if (existingMaxReEntries !== undefined && existingMaxReEntries !== reEntry.maxReEntries) {
        console.log(`Node ${id} adopting maxReEntries ${existingMaxReEntries} from group ${currentGroup}`);
        // Update both groupNumber and maxReEntries
        onReEntryUpdate({
          maxReEntries: existingMaxReEntries
        });
      }
    }
  }, [id, reEntry.enabled, reEntry.groupNumber, reEntry.maxReEntries, nodes, onReEntryUpdate]);
  
  // Handle group number change with validation
  const handleGroupNumberChange = (value: number) => {
    const newGroupNumber = value || 1;
    onReEntryUpdate({ groupNumber: newGroupNumber });
  };
  
  // Handle max re-entries change with propagation to the group
  const handleMaxReEntriesChange = (value: number) => {
    const newMaxReEntries = value || 1;
    onReEntryUpdate({ maxReEntries: newMaxReEntries });
  };
  
  return (
    <div className="space-y-3">
      <EnhancedSwitch
        id={`${id}-re-entry-toggle`}
        label="Enable Position Re-Entry"
        checked={reEntry.enabled}
        onCheckedChange={onToggle}
        tooltip="Allow position to re-enter after exit"
      />
      
      {reEntry.enabled && (
        <div className="space-y-3 pl-6 border-l-2 border-muted">
          <EnhancedNumberInput
            label="Group Number"
            value={reEntry.groupNumber}
            onChange={handleGroupNumberChange}
            min={1}
            step={1}
            tooltip="Re-entry nodes with the same group number share settings"
          />
          
          <EnhancedNumberInput
            label="Max Re-Entries"
            value={reEntry.maxReEntries}
            onChange={handleMaxReEntriesChange}
            min={1}
            step={1}
            tooltip="Maximum number of times a position can re-enter"
          />
        </div>
      )}
    </div>
  );
};

export default ReEntryControl;
