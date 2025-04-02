
import React from 'react';
import { Position } from '@/components/strategy/types/position-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle, Clock, AlertCircle } from 'lucide-react';

interface PositionCardProps {
  position: Position;
}

const PositionCard: React.FC<PositionCardProps> = ({ position }) => {
  const isBuy = position.positionType === 'buy';
  const status = position.status || 'active';
  
  // Status color mapping
  const statusColors = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    filled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    partial: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3 px-4 bg-muted/40 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full ${isBuy ? 'bg-green-100' : 'bg-red-100'}`}>
            {isBuy ? 
              <ArrowUpCircle className="h-4 w-4 text-green-600" /> : 
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
            }
          </div>
          <CardTitle className="text-sm font-medium">
            {position.vpi || position.id}
          </CardTitle>
        </div>
        <Badge 
          variant="outline" 
          className={statusColors[status as keyof typeof statusColors] || "bg-gray-500/10 text-gray-500"}
        >
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Order Type:</div>
          <div className="font-medium">{position.orderType || 'market'}</div>
          
          <div className="text-muted-foreground">Lots:</div>
          <div className="font-medium">{position.lots || 1}</div>
          
          <div className="text-muted-foreground">Product:</div>
          <div className="font-medium">{position.productType || 'intraday'}</div>
          
          {position.limitPrice && (
            <>
              <div className="text-muted-foreground">Limit Price:</div>
              <div className="font-medium">{position.limitPrice}</div>
            </>
          )}
          
          {position.optionDetails && (
            <>
              <div className="text-muted-foreground">Option:</div>
              <div className="font-medium">
                {position.optionDetails.strikeType}{' '}
                {position.optionDetails.strikeValue || ''}{' '}
                {position.optionDetails.optionType} - {position.optionDetails.expiry}
              </div>
            </>
          )}
          
          {position.vpt && (
            <>
              <div className="text-muted-foreground">Tag:</div>
              <div className="font-medium">{position.vpt}</div>
            </>
          )}
          
          {position.isRolledOut && (
            <div className="col-span-2 flex items-center mt-1 gap-1 text-amber-600">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">Position rolled out</span>
            </div>
          )}
          
          {status === 'cancelled' && (
            <div className="col-span-2 flex items-center mt-1 gap-1 text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-xs">Order cancelled</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionCard;
