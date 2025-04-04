
import { v4 as uuidv4 } from 'uuid';
import { MarketData } from '../../../types';

/**
 * Creates default data for a new node based on its type
 */
export const createDefaultNodeData = (nodeType: string, nodeId: string = '') => {
  const uniqueId = uuidv4().substring(0, 8);
  
  switch (nodeType) {
    case 'startNode':
      return {
        label: 'Start',
        timeframe: '1h',
        market: 'crypto',
        exchange: 'binance',
        symbol: 'BTCUSDT',
        backtest: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
          to: new Date().toISOString().split('T')[0], // today
          initialCapital: 10000
        },
        indicatorParameters: {}
      };
      
    case 'signalNode':
      return {
        label: 'Signal',
        conditions: [{
          id: `signal-root-${uniqueId}`,
          groupLogic: 'AND',
          conditions: []
        }]
      };
      
    case 'entrySignalNode':
      return {
        label: 'Entry Signal',
        conditions: [{
          id: `entry-root-${uniqueId}`,
          groupLogic: 'AND',
          conditions: []
        }]
      };
      
    case 'exitSignalNode':
      return {
        label: 'Exit Signal',
        conditions: [{
          id: `exit-root-${uniqueId}`,
          groupLogic: 'AND',
          conditions: []
        }]
      };
      
    case 'entryNode':
      return {
        label: 'Entry Order',
        actionType: 'entry',
        entryType: 'market',
        side: 'long',
        riskAmount: {
          type: 'fixed',
          value: 100
        },
        positions: [],
        limitPrice: 0,
        stopLoss: {
          enabled: false,
          value: 0,
          type: 'percent'
        },
        takeProfit: {
          enabled: false,
          value: 0,
          type: 'percent'
        }
      };
      
    case 'exitNode':
      return {
        label: 'Exit Order',
        actionType: 'exit',
        exitNodeData: {
          exitOrderType: 'market',
          exitConditionType: 'all',
          limitPrice: 0
        }
      };
      
    case 'alertNode':
      return {
        label: 'Alert',
        actionType: 'alert',
        alertType: 'notification',
        message: 'Strategy alert triggered',
        channels: ['app']
      };
      
    case 'modifyNode':
      return {
        label: 'Modify Position',
        actionType: 'modify',
        modifyAction: 'move_sl',
        targetPositions: 'all',
        positions: []
      };
      
    case 'endNode':
      return {
        label: 'End Branch'
      };
      
    case 'forceEndNode':
      return {
        label: 'End Strategy',
        reason: 'manual',
        customMessage: 'Strategy execution ended'
      };
      
    case 'retryNode':
      return {
        label: 'Re-entry',
        actionType: 'retry',
        retryConfig: {
          groupNumber: 1,
          maxReEntries: 1
        }
      };
      
    default:
      return {
        label: nodeType.replace('Node', '')
      };
  }
};
