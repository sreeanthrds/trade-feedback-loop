
import React, { memo, useEffect, useState, useRef } from 'react';
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
  _lastUpdated?: number; // Timestamp for forcing updates
}

interface StartNodeData {
  symbol?: string;
}

const ActionNode = ({ data, id }: { data: ActionNodeData, id: string }) => {
  const { getNodes } = useReactFlow();
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(data?.instrument);
  
  // Make a copy of data to prevent potential null reference issues
  const safeData = { ...data };
  const intervalRef = useRef<number | null>(null);
  
  // Get the start node symbol to display with optimized polling
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

    // Set up an interval with reduced frequency (500ms instead of 200ms)
    if (!intervalRef.current) {
      intervalRef.current = window.setInterval(fetchStartNodeSymbol, 500);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [getNodes]);
  
  const getActionIcon = () => {
    switch (safeData.actionType) {
      case 'entry': return safeData.positionType === 'buy' 
        ? <ArrowUpCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" /> 
        : <ArrowDownCircle className="h-5 w-5 text-rose-600 dark:text-rose-500 mr-2" />;
      case 'exit': return <X className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />;
      default: return <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />;
    }
  };
  
  const getActionLabel = () => {
    if (!safeData.actionType) return "Action";
    
    if (safeData.actionType === 'entry') {
      return `${safeData.positionType === 'buy' ? 'Buy' : 'Sell'} Entry`;
    } else if (safeData.actionType === 'exit') {
      return 'Exit Position';
    } else if (safeData.actionType === 'alert') {
      return 'Alert';
    }
    
    return safeData.label || "Action";
  };
  
  const getLots = () => {
    if (!safeData.lots) return "Not set";
    return `${safeData.lots} lot${safeData.lots > 1 ? 's' : ''}`;
  };
  
  const getOrderDetails = () => {
    const details = [];
    
    if (safeData.orderType) {
      details.push(`${safeData.orderType} order`);
    }
    
    if (safeData.orderType === 'limit' && safeData.limitPrice) {
      details.push(`@ ₹${safeData.limitPrice}`);
    }
    
    if (safeData.productType) {
      details.push(safeData.productType === 'intraday' ? 'MIS' : 'CNC');
    }
    
    return details.join(', ') || 'Default settings';
  };
  
  return (
    <div className="px-4 py-2 rounded-md bg-background/95 border border-border/50">
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
        {safeData.actionType !== 'alert' && (
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
        
        {safeData.optionDetails && (
          <>
            <div className="flex justify-between">
              <span className="text-foreground/60">Expiry:</span>
              <span className="font-medium">{safeData.optionDetails.expiry || 'W0'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-foreground/60">Strike:</span>
              <span className="font-medium">{safeData.optionDetails.strikeType || 'ATM'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-foreground/60">Option Type:</span>
              <span className="font-medium">{safeData.optionDetails.optionType || 'CE'}</span>
            </div>
          </>
        )}
        
        {safeData.actionType === 'alert' && (
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
