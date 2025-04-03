/**
 * Get a prefix for node IDs based on the node type
 */
export const getNodeTypePrefix = (type: string) => {
  switch (type) {
    case 'startNode':
      return 'start';
    case 'signalNode':
      return 'signal';
    case 'actionNode':
      return 'action';
    case 'entryNode':
      return 'entry';
    case 'exitNode':
      return 'exit';
    case 'alertNode':
      return 'alert';
    case 'modifyNode':
      return 'modify';
    case 'endNode':
      return 'end';
    case 'forceEndNode':
      return 'force-end';
    case 'retryNode':
      return 'retry';
    default:
      return 'node';
  }
};
