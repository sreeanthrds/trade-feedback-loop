
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data - these would be replaced with actual API data in production
const stocksList = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd' },
  { symbol: 'INFY', name: 'Infosys Ltd' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd' },
  { symbol: 'WIPRO', name: 'Wipro Ltd' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd' },
  { symbol: 'ITC', name: 'ITC Ltd' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd' },
];

const indexList = [
  { symbol: 'NIFTY', name: 'Nifty 50' },
  { symbol: 'BANKNIFTY', name: 'Bank Nifty' },
  { symbol: 'FINNIFTY', name: 'Financial Services Nifty' },
  { symbol: 'MIDCPNIFTY', name: 'Nifty Midcap Select' },
];

const indexFuturesList = [
  { symbol: 'NIFTYFUT', name: 'Nifty 50 Futures' },
  { symbol: 'BANKNIFTYFUT', name: 'Bank Nifty Futures' },
  { symbol: 'FINNIFTYFUT', name: 'Financial Services Nifty Futures' },
  { symbol: 'MIDCPNIFTYFUT', name: 'Nifty Midcap Select Futures' },
];

const fnoStocksList = stocksList.slice(0, 7); // For demo, assume only some stocks have F&O

export interface TradingInstrumentData {
  tradingType: 'stock' | 'futures' | 'options' | '';
  underlying?: 'index' | 'indexFuture' | 'stock' | '';
  symbol?: string;
}

interface TradingInstrumentSelectorProps {
  value: TradingInstrumentData;
  onChange: (value: TradingInstrumentData) => void;
}

const TradingInstrumentSelector: React.FC<TradingInstrumentSelectorProps> = ({
  value,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleTradingTypeChange = (tradingType: 'stock' | 'futures' | 'options') => {
    // Reset relevant fields when trading type changes
    const newData: TradingInstrumentData = {
      tradingType,
      symbol: undefined
    };
    
    // If options selected, set underlying but no symbol yet
    if (tradingType === 'options') {
      newData.underlying = '';
    } else {
      // For stock and futures, no underlying is needed
      newData.underlying = undefined;
    }
    
    onChange(newData);
  };

  const handleUnderlyingChange = (underlying: 'index' | 'indexFuture' | 'stock') => {
    onChange({
      ...value,
      underlying,
      symbol: undefined // Reset symbol when underlying changes
    });
  };

  const handleSymbolChange = (symbol: string) => {
    onChange({
      ...value,
      symbol
    });
    setOpen(false);
  };

  // Determine which symbol list to use based on trading type and underlying
  const getSymbolList = () => {
    if (value.tradingType === 'stock') {
      return stocksList;
    } else if (value.tradingType === 'futures') {
      return indexFuturesList;
    } else if (value.tradingType === 'options') {
      switch (value.underlying) {
        case 'index':
          return indexList;
        case 'indexFuture':
          return indexFuturesList;
        case 'stock':
          return fnoStocksList;
        default:
          return [];
      }
    }
    return [];
  };

  // Filter symbols based on search input
  const filteredSymbols = getSymbolList().filter(
    item => 
      item.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Trading Instrument Type</Label>
        <RadioGroup
          value={value.tradingType}
          onValueChange={(val) => handleTradingTypeChange(val as 'stock' | 'futures' | 'options')}
          className="flex flex-col space-y-1 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stock" id="trading-stock" />
            <Label htmlFor="trading-stock" className="text-sm cursor-pointer">Stock</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="futures" id="trading-futures" />
            <Label htmlFor="trading-futures" className="text-sm cursor-pointer">Futures</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="options" id="trading-options" />
            <Label htmlFor="trading-options" className="text-sm cursor-pointer">Options</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Show underlying selection only for Options */}
      {value.tradingType === 'options' && (
        <div>
          <Label htmlFor="underlying-select" className="text-sm font-medium">Underlying Type</Label>
          <Select
            value={value.underlying || ''}
            onValueChange={(val) => handleUnderlyingChange(val as 'index' | 'indexFuture' | 'stock')}
          >
            <SelectTrigger id="underlying-select" className="mt-1">
              <SelectValue placeholder="Select underlying type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="index">Index</SelectItem>
              <SelectItem value="indexFuture">Index Future</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Show symbol selection when appropriate */}
      {((value.tradingType === 'stock' || value.tradingType === 'futures') || 
        (value.tradingType === 'options' && value.underlying)) && (
        <div>
          <Label htmlFor="symbol-select" className="text-sm font-medium">Symbol</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                id="symbol-select"
                aria-expanded={open}
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1",
                  !value.symbol && "text-muted-foreground"
                )}
              >
                {value.symbol ? 
                  getSymbolList().find(item => item.symbol === value.symbol)?.symbol || value.symbol :
                  "Search for a symbol..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search for a symbol..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandEmpty>No symbol found.</CommandEmpty>
                {filteredSymbols && filteredSymbols.length > 0 ? (
                  <CommandGroup>
                    {filteredSymbols.map((item) => (
                      <CommandItem
                        key={item.symbol}
                        value={item.symbol}
                        onSelect={() => handleSymbolChange(item.symbol)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.symbol === item.symbol ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="font-medium">{item.symbol}</span>
                        <span className="ml-2 text-muted-foreground text-xs">{item.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <div className="py-6 text-center text-sm">No items to display</div>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default TradingInstrumentSelector;
