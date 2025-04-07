
import { v4 as uuidv4 } from 'uuid';

// Define position type
export interface Position {
  id: string;
  vpi?: string;
  vpt?: string;
  priority?: number;
  positionType?: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  limitPrice?: number;
  lots?: number;
  productType?: 'intraday' | 'carryForward';
  optionDetails?: {
    expiry?: string;
    strikeType?: string;
    strikeValue?: number;
    optionType?: 'CE' | 'PE';
  };
  sourceNodeId?: string;
  status?: 'active' | 'cancelled' | 'filled' | 'partial';
  isRolledOut?: boolean;
  // Add re-entry tracking information
  reEntry?: {
    enabled: boolean;
    groupNumber: number;
    maxReEntries: number;
    currentReEntryCount?: number;
  };
  _lastUpdated?: number;
}

// Type guard to check if an object is a valid Position
export function isPosition(obj: any): obj is Position {
  return obj && typeof obj === 'object' && typeof obj.id === 'string';
}

// Create a default position
export function createDefaultPosition(nodeId: string): Position {
  return {
    id: `pos-${uuidv4().slice(0, 6)}`,
    vpi: `${nodeId}-pos1`,
    vpt: '',
    priority: 1,
    positionType: 'buy',
    orderType: 'market',
    lots: 1,
    productType: 'intraday',
    status: 'active',
    isRolledOut: false,
    optionDetails: {
      expiry: 'W0',
      strikeType: 'ATM',
      optionType: 'CE'
    },
    _lastUpdated: Date.now()
  };
}

// Adapt a position to any compatible type
export function adaptPosition<T>(position: Position | null): T | null {
  if (!position) return null;
  
  return {
    ...position,
    // Ensure required fields have values
    id: position.id,
    vpi: position.vpi || '',
    vpt: position.vpt || '',
    priority: position.priority || 1,
    positionType: position.positionType || 'buy',
    orderType: position.orderType || 'market',
    limitPrice: position.limitPrice,
    lots: position.lots || 1,
    productType: position.productType || 'intraday',
    status: position.status || 'active',
    isRolledOut: position.isRolledOut || false,
    reEntry: position.reEntry ? {
      enabled: position.reEntry.enabled,
      groupNumber: position.reEntry.groupNumber,
      maxReEntries: position.reEntry.maxReEntries,
      currentReEntryCount: position.reEntry.currentReEntryCount || 0
    } : undefined,
    optionDetails: position.optionDetails ? {
      expiry: position.optionDetails.expiry || 'W0',
      strikeType: position.optionDetails.strikeType || 'ATM',
      strikeValue: position.optionDetails.strikeValue,
      optionType: position.optionDetails.optionType || 'CE'
    } : undefined,
    sourceNodeId: position.sourceNodeId,
    _lastUpdated: position._lastUpdated || Date.now()
  } as unknown as T;
}
