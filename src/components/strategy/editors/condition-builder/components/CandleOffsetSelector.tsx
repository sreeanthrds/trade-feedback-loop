
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface CandleOffsetSelectorProps {
  offset: number;
  onOffsetChange: (value: number) => void;
  label?: string;
}

const CandleOffsetSelector: React.FC<CandleOffsetSelectorProps> = ({
  offset,
  onOffsetChange,
  label = "Candle Time:"
}) => {
  const handleOffsetChange = (value: string) => {
    onOffsetChange(parseInt(value));
  };

  return (
    <div className="flex items-center gap-2">
      <Label className="text-xs whitespace-nowrap flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {label}
      </Label>
      <Select 
        value={String(offset || 0)} 
        onValueChange={handleOffsetChange}
      >
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Current candle</SelectItem>
          <SelectItem value="-1">Previous candle</SelectItem>
          <SelectItem value="-2">2 candles ago</SelectItem>
          <SelectItem value="-3">3 candles ago</SelectItem>
          <SelectItem value="-4">4 candles ago</SelectItem>
          <SelectItem value="-5">5 candles ago</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CandleOffsetSelector;
