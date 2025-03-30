
/**
 * Error handling utilities for strategy components
 */

/**
 * Handles errors in a consistent way across components
 */
export const handleError = (error: unknown, context: string): void => {
  console.error(`Error in ${context}:`, error);
  
  // Log additional information about the error if available
  if (error instanceof Error) {
    console.error(`Error message: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
  }
};

/**
 * Creates an error handler with a specific context
 */
export const createErrorHandler = (context: string) => {
  return (error: unknown) => handleError(error, context);
};
