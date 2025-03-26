
import React from 'react';
import { ActionNodeData } from './types';

interface ActionDetailsProps {
  data: ActionNodeData;
  startNodeSymbol?: string;
}

const ActionDetails: React.FC<ActionDetailsProps> = ({ data, startNodeSymbol }) => {
  const getLots = () => {
    if (!data.lots) return "Not set";
    return `${data.lots} lot${data.lots > 1 ? 's' : ''}`;
  };
  
  const getOrderDetails = () => {
    const details = [];
    
    if (data.orderType) {
      details.push(`${data.orderType} order`);
    }
    
    if (data.orderType === 'limit' && data.limitPrice) {
      details.push(`@ ₹${data.limitPrice}`);
    }
    
    if (data.productType) {
      details.push(data.productType === 'intraday' ? 'MIS' : 'CNC');
    }
    
    return details.join(', ') || 'Default settings';
  };
  
  return (
    <div className="text-xs bg-background/80 p-2 rounded-md space-y-1.5">
      {data.actionType !== 'alert' && (
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
      
      {data.optionDetails && (
        <>
          <div className="flex justify-between">
            <span className="text-foreground/60">Expiry:</span>
            <span className="font-medium">{data.optionDetails.expiry || 'W0'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-foreground/60">Strike:</span>
            <span className="font-medium">{data.optionDetails.strikeType || 'ATM'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-foreground/60">Option Type:</span>
            <span className="font-medium">{data.optionDetails.optionType || 'CE'}</span>
          </div>
        </>
      )}
      
      {data.actionType === 'alert' && (
        <div className="flex items-center justify-center py-1">
          <span className="font-medium text-amber-500 dark:text-amber-400">Send notification only</span>
        </div>
      )}
    </div>
  );
};

export default ActionDetails;
