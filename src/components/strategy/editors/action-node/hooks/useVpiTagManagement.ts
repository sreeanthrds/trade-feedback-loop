
import { useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { Position } from '../types';

interface UseVpiTagManagementProps {
  validateVpiUniqueness: (vpi: string, currentPositionId: string) => boolean;
  handlePositionChange: (positionId: string, updates: Partial<Position>) => void;
}

export const useVpiTagManagement = ({
  validateVpiUniqueness,
  handlePositionChange
}: UseVpiTagManagementProps) => {
  // Handler for updating VPI with validation
  const handleVpiChange = useCallback((positionId: string, vpi: string) => {
    if (!validateVpiUniqueness(vpi, positionId)) {
      toast({
        title: "Duplicate VPI",
        description: "This Virtual Position ID is already in use. Please choose a unique identifier.",
        variant: "destructive"
      });
      return false;
    }
    
    handlePositionChange(positionId, { vpi });
    return true;
  }, [validateVpiUniqueness, handlePositionChange]);

  // Handler for updating VPT (Virtual Position Tag)
  const handleVptChange = useCallback((positionId: string, vpt: string) => {
    handlePositionChange(positionId, { vpt });
    return true;
  }, [handlePositionChange]);

  return {
    handleVpiChange,
    handleVptChange
  };
};
