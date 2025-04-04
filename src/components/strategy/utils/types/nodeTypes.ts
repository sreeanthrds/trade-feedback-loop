
// Types of nodes in the strategy builder
export type NodeType = 
  | 'startNode'
  | 'signalNode' 
  | 'entrySignalNode'
  | 'exitSignalNode'
  | 'actionNode'
  | 'entryNode'
  | 'exitNode'
  | 'modifyNode'
  | 'alertNode'
  | 'endNode'
  | 'forceEndNode'
  | 'retryNode';

/**
 * Get the prefix for a node type (used in ID generation)
 */
export const getNodeTypePrefix = (nodeType: string): string => {
  switch (nodeType) {
    case 'startNode': return 'start';
    case 'signalNode': return 'signal';
    case 'entrySignalNode': return 'entrySignal';
    case 'exitSignalNode': return 'exitSignal';
    case 'actionNode': return 'action';
    case 'entryNode': return 'entry';
    case 'exitNode': return 'exit';
    case 'modifyNode': return 'modify';
    case 'alertNode': return 'alert';
    case 'endNode': return 'end';
    case 'forceEndNode': return 'forceEnd';
    case 'retryNode': return 'retry';
    default: return 'node';
  }
};
