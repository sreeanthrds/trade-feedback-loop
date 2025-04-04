
import { v4 as uuidv4 } from 'uuid';

export const createDefaultNodeData = (nodeType: string, nodeId: string) => {
  const timestamp = Date.now();
  const simpleId = nodeId.split('-')[1];

  switch (nodeType) {
    case 'startNode':
      return {
        label: `Start ${simpleId}`,
        timeframe: '5MIN',
        exchange: 'NSE',
        tradingInstrument: {
          type: 'stock',
          underlyingType: 'index'
        },
        indicators: [],
        symbol: 'NIFTY',
        _lastUpdated: timestamp
      };

    case 'signalNode':
      return {
        label: `Signal ${simpleId}`,
        _lastUpdated: timestamp,
        conditions: {
          type: 'simple',
          operator: 'and',
          conditions: []
        }
      };
      
    case 'entrySignalNode':
      return {
        label: `Entry Signal ${simpleId}`,
        _lastUpdated: timestamp,
        conditions: [{
          id: 'root',
          groupLogic: 'AND',
          conditions: []
        }]
      };
      
    case 'exitSignalNode':
      return {
        label: `Exit Signal ${simpleId}`,
        _lastUpdated: timestamp,
        conditions: [{
          id: 'root',
          groupLogic: 'AND',
          conditions: []
        }]
      };

    case 'actionNode':
      return {
        label: `Action ${simpleId}`,
        actionType: 'entry',
        positions: [],
        _lastUpdated: timestamp
      };

    case 'entryNode':
      return {
        label: `Entry ${simpleId}`,
        actionType: 'entry',
        positions: [
          {
            id: `pos-${uuidv4().slice(0, 6)}`,
            vpi: `${nodeId}-pos1`,
            vpt: '',
            priority: 1,
            positionType: 'buy',
            orderType: 'market',
            lots: 1,
            productType: 'intraday',
            optionDetails: {
              expiry: 'W0',
              strikeType: 'ATM',
              optionType: 'CE'
            },
            _lastUpdated: timestamp
          }
        ],
        _lastUpdated: timestamp
      };

    case 'exitNode':
      return {
        label: `Exit ${simpleId}`,
        actionType: 'exit',
        exitType: 'specific',
        positions: [],
        exitCondition: {
          type: 'positionExit',
          params: {}
        },
        _lastUpdated: timestamp
      };
      
    case 'modifyNode':
      return {
        label: `Modify ${simpleId}`,
        actionType: 'modify',
        targetPositionId: null,
        targetNodeId: null,
        modifications: {},
        _lastUpdated: timestamp
      };

    case 'alertNode':
      return {
        label: `Alert ${simpleId}`,
        actionType: 'alert',
        alertMessage: 'Strategy alert',
        alertType: 'info',
        sendEmail: false,
        sendSms: false,
        sendPush: true,
        _lastUpdated: timestamp
      };

    case 'endNode':
      return {
        label: `End ${simpleId}`,
        _lastUpdated: timestamp
      };

    case 'forceEndNode':
      return {
        label: `Force End ${simpleId}`,
        closePositions: true,
        _lastUpdated: timestamp
      };

    default:
      return {
        label: `Node ${simpleId}`,
        _lastUpdated: timestamp
      };
  }
};
