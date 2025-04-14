
import { useRef } from 'react';

/**
 * Hook to manage the state of re-entry related operations
 * Provides functionality for preventing update loops
 */
export const useReEntryStateManagement = () => {
  // Reference to track if an update is in progress
  const updatingRef = useRef<boolean>(false);
  
  return {
    updatingRef
  };
};
