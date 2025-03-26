
export type OperatorType = '==' | '!=' | '>' | '>=' | '<' | '<=' | 'crosses above' | 'crosses below' | 'is above' | 'is below';

export type ExpressionType = 'indicator' | 'market' | 'time' | 'constant' | 'complex';

export interface ExpressionValue {
  type: ExpressionType;
  value: any;
  params?: Record<string, any>;
}

export interface Condition {
  id: string;
  lhs: ExpressionValue;
  operator: OperatorType;
  rhs: ExpressionValue;
}

export interface GroupCondition {
  id: string;
  groupLogic: 'AND' | 'OR';
  conditions: (Condition | GroupCondition)[];
}

/**
 * Type guard to check if an object is a GroupCondition
 */
export function isGroupCondition(value: any): value is GroupCondition {
  return value && 
    typeof value === 'object' && 
    'groupLogic' in value && 
    'conditions' in value && 
    Array.isArray(value.conditions);
}

/**
 * Type guard to check if an object is a Condition
 */
export function isCondition(value: any): value is Condition {
  return value && 
    typeof value === 'object' && 
    'lhs' in value && 
    'operator' in value && 
    'rhs' in value;
}

/**
 * Creates an empty condition with default values
 */
export const createEmptyCondition = (): Condition => ({
  id: `condition_${Math.random().toString(36).substr(2, 9)}`,
  lhs: { type: 'indicator', value: '' },
  operator: '==',
  rhs: { type: 'constant', value: 0 }
});

/**
 * Creates an empty group condition with a single empty condition
 */
export const createEmptyGroupCondition = (): GroupCondition => ({
  id: `group_${Math.random().toString(36).substr(2, 9)}`,
  groupLogic: 'AND',
  conditions: [createEmptyCondition()]
});
