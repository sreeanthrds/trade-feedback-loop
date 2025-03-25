
import React, { memo, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { SlidersHorizontal, AlertTriangle, X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

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
    strikeType?: 'ATM' | 'ITM1' | 'ITM2' | 'ITM3' | 'ITM4' | 'ITM5' | 'ITM6' | 'ITM7' | 'ITM8' | 'ITM9' | 'ITM10' | 'ITM11' | 'ITM12' | 'ITM13' | 'ITM14' | 'ITM15' | 'OTM1' | 'OTM2' | 'OTM3' | 'OTM4' | 'OTM5' | 'OTM6' | 'OTM7' | 'OTM8' | 'OTM9' | 'OTM10' | 'OTM11' | 'OTM12' | 'OTM13' | 'OTM14' | 'OTM15' | 'premium';
    strikeValue?: number;
    optionType?: 'CE' | 'PE';
  };
}

interface StartNodeData {
  symbol?: string;
  tradingInstrument?: {
    type: 'stock' | 'futures' | 'options';
  };
}

const ActionNode = ({ data, id }: { data: ActionNodeData, id: string }) => {
  const { getNodes } = useReactFlow();
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(data.instrument);
  const [hasOptionTrading, setHasOptionTrading] = useState(false);
  
  // Get the start node symbol to display and check if options trading is enabled
  useEffect(() => {
    const fetchStartNodeData = () => {
      const nodes = getNodes();
      const startNode = nodes.find(node => node.type === 'startNode');
      if (startNode && startNode.data) {
        const startData = startNode.data as StartNodeData;
        
        // Update symbol if different
        if (startData.symbol !== startNodeSymbol) {
          setStartNodeSymbol(startData.symbol);
        }
        
        // Check if options trading is enabled
        const optionsEnabled = startData.tradingInstrument?.type === 'options';
        setHasOptionTrading(optionsEnabled || false);
      }
    };

    // Initial fetch
    fetchStartNodeData();

    // Set up an interval to check for changes
    const intervalId = setInterval(fetchStartNodeData, 200);

    return () => clearInterval(intervalId);
  }, [getNodes, startNodeSymbol]);
  
  const getActionIcon = () => {
    switch (data.actionType) {
      case 'entry': return data.positionType === 'buy' 
        ? <ArrowUpCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" /> 
        : <ArrowDownCircle className="h-5 w-5 text-rose-600 dark:text-rose-500 mr-2" />;
      case 'exit': return <X className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />;
      default: return <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />;
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
        
        {hasOptionTrading && data.optionDetails && (
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
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#FF9800' }}
      />
    </div>
  );
};

export default memo(ActionNode);
