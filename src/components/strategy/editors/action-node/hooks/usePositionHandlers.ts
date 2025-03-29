
import { useCallback } from 'react';
import { Position } from '../types';

interface UsePositionHandlersProps {
  selectedPosition: Position | null;
  handlePositionChange: (positionId: string, updates: Partial<Position>) => void;
}

export const usePositionHandlers = ({
  selectedPosition,
  handlePositionChange
}: UsePositionHandlersProps) => {
  // Handler for the selected position
  const handleSelectedPositionChange = useCallback((updates: Partial<Position>) => {
    if (!selectedPosition) return;
    
    handlePositionChange(selectedPosition.id, updates);
  }, [selectedPosition, handlePositionChange]);

  // Generate position-specific handlers
  const positionHandlers = selectedPosition ? {
    handlePositionTypeChange: (value: string) => 
      handleSelectedPositionChange({ positionType: value as 'buy' | 'sell' }),
    
    handleOrderTypeChange: (value: string) => 
      handleSelectedPositionChange({ 
        orderType: value as 'market' | 'limit',
        ...(value === 'market' && { limitPrice: undefined })
      }),
    
    handleLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
      if (value === undefined || !isNaN(value)) {
        handleSelectedPositionChange({ limitPrice: value });
      }
    },
    
    handleLotsChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value > 0) {
        handleSelectedPositionChange({ lots: value });
      }
    },
    
    handleProductTypeChange: (value: string) => 
      handleSelectedPositionChange({ productType: value as 'intraday' | 'carryForward' }),
    
    handleExpiryChange: (value: string) => 
      handleSelectedPositionChange({ 
        optionDetails: {
          ...selectedPosition.optionDetails,
          expiry: value
        }
      }),
    
    handleStrikeTypeChange: (value: string) => {
      // Make sure we validate the value to match the expected type
      const validatedValue = value as Position['optionDetails']['strikeType'];
      
      const updatedDetails = {
        ...selectedPosition.optionDetails,
        strikeType: validatedValue
      };
      
      // If changing to premium type and no strike value is set, set a default
      if (value === 'premium' && !selectedPosition.optionDetails?.strikeValue) {
        updatedDetails.strikeValue = 100;
      }
      
      handleSelectedPositionChange({ optionDetails: updatedDetails });
    },
    
    handleStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        handleSelectedPositionChange({ 
          optionDetails: {
            ...selectedPosition.optionDetails,
            strikeValue: value
          }
        });
      }
    },
    
    handleOptionTypeChange: (value: string) => {
      // Make sure we validate the value to match the expected type
      const validatedValue = value as 'CE' | 'PE';
      
      handleSelectedPositionChange({ 
        optionDetails: {
          ...selectedPosition.optionDetails,
          optionType: validatedValue
        }
      });
    }
  } : {
    handlePositionTypeChange: () => {},
    handleOrderTypeChange: () => {},
    handleLimitPriceChange: () => {},
    handleLotsChange: () => {},
    handleProductTypeChange: () => {},
    handleExpiryChange: () => {},
    handleStrikeTypeChange: () => {},
    handleStrikeValueChange: () => {},
    handleOptionTypeChange: () => {}
  };

  return {
    handleSelectedPositionChange,
    ...positionHandlers
  };
};
