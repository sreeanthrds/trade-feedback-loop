
import { v4 as uuidv4 } from 'uuid';
import { NodeType } from '../../types/nodeTypes';

/**
 * Create default data structure for a new node
 */
export const createDefaultNodeData = (nodeType: NodeType, nodeId: string) => {
  const defaultData: any = {
    label: getDefaultLabel(nodeType),
    _id: nodeId
  };

  // Add node-type specific default data
  switch (nodeType) {
    case 'startNode':
      defaultData.indicatorParameters = {};
      defaultData.timerSettings = { interval: '1m' };
      break;

    case 'signalNode':
      defaultData.conditions = [{
        id: 'root',
        groupLogic: 'AND',
        conditions: []
      }];
      break;

    case 'entrySignalNode':
      defaultData.conditions = [{
        id: `entry-root-${uuidv4().substring(0, 8)}`,
        groupLogic: 'AND',
        conditions: []
      }];
      break;

    case 'exitSignalNode':
      defaultData.conditions = [{
        id: `exit-root-${uuidv4().substring(0, 8)}`,
        groupLogic: 'AND',
        conditions: []
      }];
      break;

    case 'entryNode':
      defaultData.orderType = 'market';
      defaultData.direction = 'long';
      defaultData.positionSize = {
        type: 'percentage',
        value: 100
      };
      break;

    case 'exitNode':
      defaultData.exitType = 'market';
      defaultData.exitNodeData = {
        positionSelection: 'all',
        exitConditions: [],
        reEntryConfig: {
          enabled: false,
          maxReEntries: 1,
          groupNumber: 1
        }
      };
      break;

    case 'actionNode':
      defaultData.actionType = 'notification';
      defaultData.message = 'Strategy event notification';
      break;

    default:
      break;
  }

  return defaultData;
};

/**
 * Get default label for node type
 */
const getDefaultLabel = (nodeType: NodeType): string => {
  switch (nodeType) {
    case 'startNode': return 'Start';
    case 'signalNode': return 'Signal';
    case 'entrySignalNode': return 'Entry Signal';
    case 'exitSignalNode': return 'Exit Signal';
    case 'actionNode': return 'Action';
    case 'entryNode': return 'Entry';
    case 'exitNode': return 'Exit';
    case 'modifyNode': return 'Modify Position';
    case 'alertNode': return 'Alert';
    case 'endNode': return 'End';
    case 'forceEndNode': return 'Force End';
    case 'retryNode': return 'Retry';
    default: return 'Node';
  }
};
