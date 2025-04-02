
/**
 * Shared position type definitions to ensure consistency across components
 */

// Base option details interface that's compatible with both usages
export interface OptionDetails {
  expiry: string;
  strikeType: string;
  strikeValue?: number;
  optionType: string;
}

// Base position interface with common properties
export interface BasePosition {
  id: string;
  vpi: string;
  vpt: string;
  priority: number;
  positionType: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  limitPrice?: number;
  lots?: number;
  productType: 'intraday' | 'carryForward';
  _lastUpdated?: number;
  sourceNodeId?: string;
}

// Position interface that's compatible with all usages
export interface Position extends BasePosition {
  optionDetails?: OptionDetails;
}

// Type guard to check if an object is a Position
export function isPosition(obj: any): obj is Position {
  return obj && 
         typeof obj === 'object' && 
         typeof obj.id === 'string' && 
         typeof obj.vpi === 'string' &&
         typeof obj.positionType === 'string';
}

// Utility function to safely convert between position types
export function adaptPosition<T extends Record<string, any>>(position: any): T {
  if (!position) return {} as T;
  
  // Create a base position object with required fields
  const basePosition: BasePosition = {
    id: position.id || '',
    vpi: position.vpi || '',
    vpt: position.vpt || '',
    priority: position.priority || 1,
    positionType: position.positionType || 'buy',
    orderType: position.orderType || 'market',
    limitPrice: position.limitPrice,
    lots: position.lots,
    productType: position.productType || 'intraday',
    sourceNodeId: position.sourceNodeId,
    _lastUpdated: position._lastUpdated
  };
  
  // Add optionDetails if present
  if (position.optionDetails) {
    return {
      ...basePosition,
      optionDetails: {
        expiry: position.optionDetails.expiry || '',
        strikeType: position.optionDetails.strikeType || '',
        strikeValue: position.optionDetails.strikeValue,
        optionType: position.optionDetails.optionType || ''
      }
    } as unknown as T;
  }
  
  return basePosition as unknown as T;
}
