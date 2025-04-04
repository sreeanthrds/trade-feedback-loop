
// Re-export all condition types and functions
export * from './types';
export * from './factories';
export * from './stringRepresentation';

// For backward compatibility, ensure createEmptyExpression is explicitly exported
import { createDefaultExpression } from './factories';
export const createEmptyExpression = createDefaultExpression;
