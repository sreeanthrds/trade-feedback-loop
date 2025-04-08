
/**
 * Error handling utilities for Supabase operations
 */

/**
 * Log an error that occurred during a database operation
 * @param operation - The name of the operation that failed
 * @param error - The error object
 */
export const logDatabaseError = (operation: string, error: any): void => {
  console.error(`Error in ${operation}:`, error);
};
