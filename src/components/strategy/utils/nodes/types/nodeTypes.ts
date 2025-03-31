
/**
 * Helper function to get the node type prefix for generating IDs
 */
export const getNodeTypePrefix = (type: string): string => {
  switch (type) {
    case 'startNode': return 'start';
    case 'signalNode': return 'signal';
    case 'actionNode': return 'action';
    case 'entryNode': return 'entry';
    case 'exitNode': return 'exit';
    case 'alertNode': return 'alert';
    case 'endNode': return 'end';
    case 'forceEndNode': return 'force-end';
    default: return type.replace('Node', '').toLowerCase();
  }
};

/**
 * Get the default label for a node based on its type
 */
export const getDefaultNodeLabel = (type: string): string => {
  switch (type) {
    case 'startNode': return 'Start';
    case 'endNode': return 'End';
    case 'forceEndNode': return 'Force End';
    case 'signalNode': return 'Signal';
    case 'entryNode': return 'Entry Order';
    case 'exitNode': return 'Exit Order';
    case 'alertNode': return 'Alert';
    default: return 'Action';
  }
};
