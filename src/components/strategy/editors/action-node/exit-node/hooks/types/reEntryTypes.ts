
import { Node } from '@xyflow/react';
import { ExitNodeData } from '../../types';

export interface UseReEntryGroupSyncProps {
  node?: Node;
  updateNodeData?: (id: string, data: any) => void;
  defaultExitNodeData?: ExitNodeData;
}

export interface RetryNodeData {
  retryConfig?: {
    groupNumber?: number;
    maxReEntries?: number;
  };
}

export interface LeaderNodeInfo {
  maxReEntries: number;
  groupNumber: number;
  nodeId: string;
}

export type NodeWithReEntryConfig = Node & {
  data: {
    exitNodeData?: ExitNodeData;
    retryConfig?: {
      groupNumber?: number;
      maxReEntries?: number;
    };
  };
};
