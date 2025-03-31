
// Export types
export type { LabelProps } from './types';
export type { ValidationProps } from './types';
export type { LoadingProps } from './types';
export type { ErrorHandlingProps } from './types';

// Export HOCs
export { default as withLabel } from './withLabel';
export { default as withFormValidation } from './withFormValidation';
export { default as withLoadingState } from './withLoadingState';
export { default as withErrorHandling } from './withErrorHandling';
export { default as composeHOC } from './composeHOC';

// Re-export the HOC implementation for backward compatibility
export { withLabel } from './withLabel';
export { withFormValidation } from './withFormValidation';
export { withLoadingState } from './withLoadingState';
export { withErrorHandling } from './withErrorHandling';
export { composeHOC } from './composeHOC';
