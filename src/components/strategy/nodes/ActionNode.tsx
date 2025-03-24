
import React, { memo, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { SlidersHorizontal, AlertTriangle, CircleDollarSign, X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface ActionNodeData {
  label?: string;
  actionType?: 'entry' | 'exit' | 'alert';
  positionType?: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  limitPrice?: number;
  lots?: number;
  productType?: 'intraday' | 'carryForward';
  instrument?: string;
  optionDetails?: {
    expiry?: string;
    strikeType?: 'ATM' | 'ITM' | 'OTM' | 'premium';
    strikeValue?: number;
    optionType?: 'CE' | 'PE';
  };
}

interface StartNodeData {
  symbol?: string;
}

const ActionNode = ({ data, id }: { data: ActionNodeData, id: string }) => {
  const { getNodes } = useReactFlow();
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(data.instrument);
  
  // Get the start node symbol to display
  useEffect(() => {
    const fetchStartNodeSymbol = () => {
      const nodes = getNodes();
      const startNode = nodes.find(node => node.type === 'startNode');
      if (startNode && startNode.data) {
        const startData = startNode.data as StartNodeData;
        if (startData.symbol !== startNodeSymbol) {
          setStartNodeSymbol(startData.symbol);
        }
      }
    };

    // Initial fetch
    fetchStartNodeSymbol();

    // Set up an interval to check for changes - more frequent updates for better responsiveness
    const intervalId = setInterval(fetchStartNodeSymbol, 200);

    return () => clearInterval(intervalId);
  }, [getNodes, startNodeSymbol]);
  
  const getActionIcon = () => {
    switch (data.actionType) {
      case 'entry': return data.positionType === 'buy' 
        ? <ArrowUpCircle className="h-5 w-5 text-success mr-2" /> 
        : <ArrowDownCircle className="h-5 w-5 text-destructive mr-2" />;
      case 'exit': return <X className="h-5 w-5 text-warning mr-2" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />;
      default: return <SlidersHorizontal className="h-5 w-5 text-warning mr-2" />;
    }
  };
  
  const getActionLabel = () => {
    if (!data.actionType) return "Action";
    
    if (data.actionType === 'entry') {
      return `${data.positionType === 'buy' ? 'Buy' : 'Sell'} Entry`;
    } else if (data.actionType === 'exit') {
      return 'Exit Position';
    } else if (data.actionType === 'alert') {
      return 'Alert';
    }
    
    return data.label || "Action";
  };
  
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
  
  const getOptionDetails = () => {
    if (!data.optionDetails) return null;
    
    const { expiry, strikeType, strikeValue, optionType } = data.optionDetails;
    let details = [];
    
    if (expiry) details.push(expiry);
    if (strikeType) {
      if (strikeType === 'premium' && strikeValue) {
        details.push(`Premium ~₹${strikeValue}`);
      } else {
        details.push(strikeType);
      }
    }
    if (optionType) details.push(optionType);
    
    return details.join(' ');
  };
  
  return (
    <div className="px-4 py-2 rounded-md bg-background/95">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#FF9800' }}
      />
      
      <div className="flex items-center mb-2">
        {getActionIcon()}
        <div className="font-medium">{getActionLabel()}</div>
      </div>
      
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
        
        {getOptionDetails() && (
          <div className="flex justify-between">
            <span className="text-foreground/60">Options:</span>
            <span className="font-medium">{getOptionDetails()}</span>
          </div>
        )}
        
        {data.actionType === 'alert' && (
          <div className="flex items-center justify-center py-1">
            <span className="font-medium text-amber-500">Send notification only</span>
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#FF9800' }}
      />
    </div>
  );
};

export default memo(ActionNode);
