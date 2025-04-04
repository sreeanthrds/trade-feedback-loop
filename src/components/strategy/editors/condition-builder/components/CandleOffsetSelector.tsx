import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import { cn } from '@/lib/utils';

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
  const [inputMode, setInputMode] = useState<'preset' | 'custom'>('preset');
  
  useEffect(() => {
    if (offset < -5 || offset > 0) {
      setInputMode('custom');
    } else {
      setInputMode('preset');
    }
  }, []);

  const handlePresetChange = (value: string) => {
    if (value === 'custom') {
      setInputMode('custom');
    } else {
      onOffsetChange(parseInt(value));
      setInputMode('preset');
    }
  };
  
  const handleCustomChange = (value: number | undefined) => {
    if (value !== undefined) {
      const finalValue = value > 0 ? -value : value;
      onOffsetChange(finalValue);
    }
  };

  const getCurrentPresetValue = () => {
    if (inputMode === 'custom' || offset < -5 || offset > 0) {
      return 'custom';
    }
    return String(offset);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-xs whitespace-nowrap flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {label}
        </Label>
        <Select 
          value={getCurrentPresetValue()} 
          onValueChange={handlePresetChange}
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
            <SelectItem value="custom">Custom lookback...</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inputMode === 'custom' && (
        <div className={cn("flex items-center gap-2", inputMode === 'custom' ? 'animate-in fade-in-0' : '')}>
          <Label className="text-xs whitespace-nowrap">
            Candles ago:
          </Label>
          <EnhancedNumberInput 
            value={Math.abs(offset)}
            onChange={(value) => handleCustomChange(value ? -Math.abs(value) : 0)}
            className="w-20 h-8"
            min={0}
            max={100}
            step={1}
          />
        </div>
      )}
    </div>
  );
};

export default CandleOffsetSelector;
