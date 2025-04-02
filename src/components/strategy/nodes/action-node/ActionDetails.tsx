
import React from 'react';
import { Position } from '@/components/strategy/types/position-types';

interface ActionDetailsProps {
  positions?: Position[];
  actionType: 'entry' | 'exit' | 'alert' | 'modify';
  nodeId: string;
  startNodeSymbol?: string;
}

const ActionDetails: React.FC<ActionDetailsProps> = ({ positions, actionType, nodeId, startNodeSymbol }) => {
  // For backward compatibility, check the first position if positions exist
  const firstPosition = positions && positions.length > 0 ? positions[0] : null;
  
  const getLots = () => {
    if (!firstPosition || !firstPosition.lots) return "Not set";
    return `${firstPosition.lots} lot${firstPosition.lots > 1 ? 's' : ''}`;
  };
  
  const getOrderDetails = () => {
    if (!firstPosition) return "Default settings";
    
    const details = [];
    
    if (firstPosition.orderType) {
      details.push(`${firstPosition.orderType} order`);
    }
    
    if (firstPosition.orderType === 'limit' && firstPosition.limitPrice) {
      details.push(`@ ₹${firstPosition.limitPrice}`);
    }
    
    if (firstPosition.productType) {
      details.push(firstPosition.productType === 'intraday' ? 'MIS' : 'CNC');
    }
    
    return details.join(', ') || 'Default settings';
  };
  
  return (
    <div className="text-xs bg-background/80 p-2 rounded-md space-y-1.5">
      {actionType !== 'alert' && (
        <>
          <div className="flex justify-between">
            <span className="text-foreground/60">Quantity:</span>
            <span className="font-medium">{getLots()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-foreground/60">Order:</span>
            <span className="font-medium">{getOrderDetails()}</span>
          </div>
        </>
      )}
      
      {startNodeSymbol && (
        <div className="flex justify-between">
          <span className="text-foreground/60">Instrument:</span>
          <span className="font-medium">{startNodeSymbol}</span>
        </div>
      )}
      
      {firstPosition && firstPosition.optionDetails && (
        <>
          <div className="flex justify-between">
            <span className="text-foreground/60">Expiry:</span>
            <span className="font-medium">{firstPosition.optionDetails.expiry || 'W0'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-foreground/60">Strike:</span>
            <span className="font-medium">
              {firstPosition.optionDetails.strikeType === 'premium' 
                ? `Premium ₹${firstPosition.optionDetails.strikeValue || 100}` 
                : firstPosition.optionDetails.strikeType || 'ATM'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-foreground/60">Option Type:</span>
            <span className="font-medium">{firstPosition.optionDetails.optionType || 'CE'}</span>
          </div>
        </>
      )}
      
      {actionType === 'alert' && (
        <div className="flex items-center justify-center py-1">
          <span className="font-medium text-amber-500 dark:text-amber-400">Send notification only</span>
        </div>
      )}
    </div>
  );
};

export default ActionDetails;
